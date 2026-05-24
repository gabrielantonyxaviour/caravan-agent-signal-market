import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const targetUrl = process.env.CARAVAN_E2E_URL ?? "http://127.0.0.1:3037";
const outputDir = path.resolve("outputs/readiness-e2e");
const reportPath = path.resolve("outputs/readiness-e2e.md");
const jsonPath = path.resolve("outputs/readiness-e2e.json");
const arcChainId = "0x4cef52";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHttp(url, timeoutMs = 30000) {
  const startedAt = Date.now();
  let lastError;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error(`${url} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(250);
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function connectWebSocket(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.addEventListener("open", () => resolve(socket), { once: true });
    socket.addEventListener("error", () => reject(new Error(`Could not connect to ${url}`)), {
      once: true,
    });
  });
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  close() {
    this.socket.close();
  }
}

async function launchChrome() {
  const userDataDir = await mkdtemp(path.join(tmpdir(), "caravan-e2e-"));
  const port = 9600 + Math.floor(Math.random() * 300);
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ]);
  chrome.stderr.resume();
  chrome.stdout.resume();
  return {
    port,
    async dispose() {
      chrome.kill("SIGTERM");
      await delay(250);
      await rm(userDataDir, { force: true, recursive: true });
    },
  };
}

async function createPage(port) {
  const target = await fetchJson(`http://127.0.0.1:${port}/json/new?about:blank`, {
    method: "PUT",
  });
  const socket = await connectWebSocket(target.webSocketDebuggerUrl);
  const client = new CdpClient(socket);
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  return client;
}

async function evaluate(client, expression, awaitPromise = false) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result.value;
}

async function setViewport(client, width, height) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  });
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  await delay(3200);
}

async function screenshot(client, filePath) {
  const result = await client.send("Page.captureScreenshot", {
    captureBeyondViewport: false,
    format: "png",
    fromSurface: true,
  });
  await writeFile(filePath, Buffer.from(result.data, "base64"));
}

async function injectWallet(client) {
  await client.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      (() => {
        let chainId = "0x1";
        window.ethereum = {
          async request(args) {
            if (args.method === "eth_requestAccounts") {
              return ["0x1111111111111111111111111111111111111111"];
            }
            if (args.method === "eth_chainId") {
              return chainId;
            }
            if (args.method === "wallet_switchEthereumChain") {
              chainId = args.params?.[0]?.chainId || "${arcChainId}";
              return null;
            }
            if (args.method === "personal_sign") {
              return "0x" + "a".repeat(130);
            }
            throw new Error("Unsupported method " + args.method);
          }
        };
      })();
    `,
  });
}

async function inspectActions(client) {
  return evaluate(
    client,
    `(() => {
      const items = [...document.querySelectorAll('button,a')]
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
        })
        .map((node) => ({
          tag: node.tagName,
          text: node.innerText.trim(),
          href: node.getAttribute('href'),
          disabled: Boolean(node.disabled),
        }));
      const invalid = items.filter((item) => {
        if (!item.text) return true;
        if (item.tag === 'A') return !(item.href?.startsWith('#') || item.href?.startsWith('http'));
        return false;
      });
      return { items, invalid };
    })()`,
  );
}

async function clickButton(client, text, expectedText, timeoutMs = 10000) {
  return evaluate(
    client,
    `new Promise((resolve) => {
      const button = [...document.querySelectorAll('button')]
        .find((item) => item.innerText.includes(${JSON.stringify(text)}));
      if (!button) {
        resolve({ clicked: false, reason: 'button not found' });
        return;
      }
      button.scrollIntoView({ block: 'center' });
      button.click();
      const startedAt = Date.now();
      const timer = setInterval(() => {
        const bodyText = document.body.innerText;
        if (Date.now() - startedAt > ${timeoutMs}) {
          clearInterval(timer);
          resolve({ clicked: true, bodyText });
        }
        if (bodyText.includes(${JSON.stringify(expectedText)})) {
          clearInterval(timer);
          resolve({ clicked: true, bodyText });
        }
      }, 250);
    })`,
    true,
  );
}

async function runNoWalletFlow(port, summary) {
  const client = await createPage(port);
  await setViewport(client, 375, 900);
  await navigate(client, targetUrl);
  const blocked = await clickButton(
    client,
    "Connect wallet",
    "Wallet connect blocked",
  );
  const live = await clickButton(
    client,
    "Run live check",
    "Live market frame",
    12000,
  );
  const actions = await inspectActions(client);
  const shot = path.join(outputDir, "no-wallet-375.png");
  await screenshot(client, shot);
  client.close();
  summary.screenshots.push(shot);
  summary.flows.noWallet = {
    walletBlocked: blocked.bodyText?.includes("Wallet connect blocked") === true,
    liveMarketReached: live.bodyText?.includes("Live market frame") === true,
    actionAudit: actions,
  };
}

async function runInjectedWalletFlow(port, summary) {
  const client = await createPage(port);
  await injectWallet(client);
  await setViewport(client, 1440, 1000);
  await navigate(client, targetUrl);
  await evaluate(
    client,
    `new Promise((resolve) => {
      const startedAt = Date.now();
      const timer = setInterval(() => {
        if (document.body.innerText.includes('Wallet provider detected') || Date.now() - startedAt > 5000) {
          clearInterval(timer);
          resolve(true);
        }
      }, 200);
    })`,
    true,
  );
  const connect = await clickButton(
    client,
    "Connect wallet",
    "signed a CARAVAN session",
  );
  const session = await evaluate(
    client,
    `(() => {
      const raw = sessionStorage.getItem('caravan.wallet.session.v1');
      return raw ? JSON.parse(raw) : null;
    })()`,
  );
  const shot = path.join(outputDir, "wallet-connected-1440.png");
  await screenshot(client, shot);
  client.close();
  summary.screenshots.push(shot);
  summary.flows.injectedWallet = {
    connected: connect.bodyText?.includes("signed a CARAVAN session") === true,
    account: session?.account,
    chainId: session?.chainId,
    hasSignature: typeof session?.signature === "string" && session.signature.length > 10,
  };
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await waitForHttp(targetUrl);
  const coingecko = await fetchJson(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd",
  );
  const summary = {
    targetUrl,
    generatedAt: new Date().toISOString(),
    coingeckoProof: {
      bitcoin: typeof coingecko.bitcoin?.usd === "number",
      ethereum: typeof coingecko.ethereum?.usd === "number",
      solana: typeof coingecko.solana?.usd === "number",
    },
    flows: {},
    screenshots: [],
  };

  const chrome = await launchChrome();
  try {
    await waitForHttp(`http://127.0.0.1:${chrome.port}/json/version`);
    await runNoWalletFlow(chrome.port, summary);
    await runInjectedWalletFlow(chrome.port, summary);
  } finally {
    await chrome.dispose();
  }

  const passed =
    summary.coingeckoProof.bitcoin &&
    summary.coingeckoProof.ethereum &&
    summary.coingeckoProof.solana &&
    summary.flows.noWallet.walletBlocked &&
    summary.flows.noWallet.liveMarketReached &&
    summary.flows.noWallet.actionAudit.invalid.length === 0 &&
    summary.flows.injectedWallet.connected &&
    summary.flows.injectedWallet.chainId === arcChainId &&
    summary.flows.injectedWallet.hasSignature;

  const markdown = [
    "# Readiness E2E",
    "",
    `Target: ${targetUrl}`,
    `Generated: ${summary.generatedAt}`,
    `Status: ${passed ? "passed" : "failed"}`,
    "",
    "## Primary Flow",
    `- Run live check reached live market frame: ${summary.flows.noWallet.liveMarketReached}`,
    `- CoinGecko BTC/ETH/SOL fields present: ${summary.coingeckoProof.bitcoin && summary.coingeckoProof.ethereum && summary.coingeckoProof.solana}`,
    "",
    "## Auth Flow",
    `- No-wallet failure state shown: ${summary.flows.noWallet.walletBlocked}`,
    `- Injected EIP-1193 provider signed session: ${summary.flows.injectedWallet.connected}`,
    `- Injected provider chain id: ${summary.flows.injectedWallet.chainId}`,
    "",
    "## No-Dummy Action Audit",
    `- Visible actions checked: ${summary.flows.noWallet.actionAudit.items.length}`,
    `- Invalid actions found: ${summary.flows.noWallet.actionAudit.invalid.length}`,
    "",
    "## Screenshots",
    ...summary.screenshots.map((item) => `- \`${path.relative(process.cwd(), item)}\``),
  ].join("\n");

  await writeFile(jsonPath, `${JSON.stringify(summary, null, 2)}\n`);
  await writeFile(reportPath, `${markdown}\n`);

  if (!passed) {
    process.stderr.write(`${markdown}\n`);
    process.exit(1);
  }
  process.stdout.write(`${markdown}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exit(1);
});
