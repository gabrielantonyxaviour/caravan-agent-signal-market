import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const chromePath =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const targetUrl =
  process.env.CARAVAN_QA_URL ??
  "https://caravan-agent-signal-market.vercel.app";
const outputDir = path.resolve("outputs/screenshots");
const reportPath = path.resolve("outputs/local-visual-qa-hardening.md");
const jsonPath = path.resolve("outputs/local-visual-qa-hardening.json");
const viewports = [{ width: 375, height: 900, mobile: true }, { width: 768, height: 1024, mobile: false }, { width: 1440, height: 1000, mobile: false }];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function waitForJson(url, timeoutMs = 8000) {
  const startedAt = Date.now();
  let lastError;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      return await fetchJson(url);
    } catch (error) {
      lastError = error;
      await delay(150);
    }
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

function connectWebSocket(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.addEventListener("open", () => resolve(socket), { once: true });
    socket.addEventListener("error", () => reject(new Error(`Could not connect to ${url}`)), { once: true });
  });
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
        return;
      }
      if (message.method) this.events.push(message);
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
  const userDataDir = await mkdtemp(path.join(tmpdir(), "caravan-visual-qa-"));
  const port = 9300 + Math.floor(Math.random() * 500);
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
    chrome,
    port,
    userDataDir,
    async dispose() {
      chrome.kill("SIGTERM");
      await delay(250);
      await rm(userDataDir, { force: true, recursive: true });
    },
  };
}

async function createPage(port) {
  const target = await fetchJson(
    `http://127.0.0.1:${port}/json/new?about:blank`,
    { method: "PUT" },
  );
  const socket = await connectWebSocket(target.webSocketDebuggerUrl);
  const client = new CdpClient(socket);
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Log.enable");
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

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  await client.send("Page.loadEventFired").catch(() => undefined);
  await delay(3200);
}

async function setViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile,
  });
}

async function screenshot(client, filePath) {
  const result = await client.send("Page.captureScreenshot", {
    captureBeyondViewport: false, format: "png", fromSurface: true,
  });
  await writeFile(filePath, Buffer.from(result.data, "base64"));
}

async function inspectPage(client) {
  return evaluate(
    client,
    `(() => {
      const text = document.body.innerText;
      const rects = [...document.querySelectorAll('h1,h2,p,button,a,article,section,div')]
        .filter((node) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
        })
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return { tag: node.tagName, text: node.innerText?.slice(0, 80) ?? '', left: rect.left, right: rect.right };
        });
      const offenders = rects.filter((item) => item.left < -1 || item.right > window.innerWidth + 1);
      return {
        title: document.title,
        hasHero: text.includes('Agents sell alpha'),
        hasFixtureLabel: text.includes('DEMO FIXTURE'),
        hasSignalLedger: text.includes('Signal ledger'),
        hasProofLabel: text.includes('fixture chain proof') || text.includes('no Arc tx configured'),
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        overflowOffenders: offenders.slice(0, 8),
      };
    })()`,
  );
}

async function clickLiveCheck(client) {
  return evaluate(
    client,
    `new Promise((resolve) => {
      const button = [...document.querySelectorAll('button')]
        .find((item) => item.innerText.includes('Run live check'));
      if (!button) {
        resolve({ clicked: false, reason: 'Run live check button not found' });
        return;
      }
      button.scrollIntoView({ block: 'center' });
      button.click();
      const startedAt = Date.now();
      const timer = setInterval(() => {
        const text = document.body.innerText;
        if (text.includes('Live market frame')) {
          clearInterval(timer);
          resolve({ clicked: true, live: true, text: 'Live market frame' });
        } else if (Date.now() - startedAt > 10000) {
          clearInterval(timer);
          resolve({ clicked: true, live: false, text: text.slice(0, 500) });
        }
      }, 250);
    })`,
    true,
  );
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const chrome = await launchChrome();
  const summary = {
    targetUrl,
    generatedAt: new Date().toISOString(),
    screenshots: [],
    viewports: [],
    primaryFlow: null,
  };

  try {
    await waitForJson(`http://127.0.0.1:${chrome.port}/json/version`);
    const client = await createPage(chrome.port);

    for (const viewport of viewports) {
      await setViewport(client, viewport);
      await navigate(client, targetUrl);
      const proof = await inspectPage(client);
      const filePath = path.join(outputDir, `hardening-${viewport.width}-fixture.png`);
      await screenshot(client, filePath);
      summary.screenshots.push(filePath);
      summary.viewports.push({ viewport, proof, screenshot: filePath });
    }

    await setViewport(client, { width: 1440, height: 1000, mobile: false });
    await navigate(client, targetUrl);
    summary.primaryFlow = await clickLiveCheck(client);
    await evaluate(client, "window.scrollTo(0, 0); true");
    await delay(500);
    const livePath = path.join(outputDir, "hardening-1440-live.png");
    await screenshot(client, livePath);
    summary.screenshots.push(livePath);
    client.close();
  } finally {
    await chrome.dispose();
  }

  const failedViewport = summary.viewports.find((item) => !item.proof.hasHero || !item.proof.hasFixtureLabel || !item.proof.hasSignalLedger || !item.proof.hasProofLabel || item.proof.horizontalOverflow);
  const passed = !failedViewport && summary.primaryFlow?.live === true;
  const markdown = [
    "# Local Visual QA Hardening",
    "",
    `Target: ${targetUrl}`,
    `Generated: ${summary.generatedAt}`,
    `Status: ${passed ? "local-visual-qa-passed" : "local-visual-qa-failed"}`,
    "",
    "## Screenshots",
    ...summary.screenshots.map((item) => `- \`${path.relative(process.cwd(), item)}\``),
    "",
    "## Viewport Checks",
    ...summary.viewports.map(
      ({ viewport, proof, screenshot }) =>
        `- ${viewport.width}x${viewport.height}: hero=${proof.hasHero}; fixture-label=${proof.hasFixtureLabel}; signal-ledger=${proof.hasSignalLedger}; proof-label=${proof.hasProofLabel}; horizontal-overflow=${proof.horizontalOverflow}; screenshot=\`${path.relative(process.cwd(), screenshot)}\``,
    ),
    "",
    "## Primary Flow",
    `- Run live check clicked: ${summary.primaryFlow?.clicked === true}`,
    `- Live market frame reached: ${summary.primaryFlow?.live === true}`,
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
