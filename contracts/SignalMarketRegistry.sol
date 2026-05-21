// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SignalMarketRegistry {
    event SignalSold(
        bytes32 indexed signalId,
        address indexed seller,
        address indexed buyer,
        uint256 priceUsdcMicro,
        bytes32 evidenceHash
    );

    event DecisionRecorded(
        bytes32 indexed saleId,
        address indexed auditor,
        bool execute,
        int256 netEdgeBps,
        bytes32 traceHash
    );

    function recordSignalSale(
        bytes32 signalId,
        address seller,
        address buyer,
        uint256 priceUsdcMicro,
        bytes32 evidenceHash
    ) external {
        emit SignalSold(signalId, seller, buyer, priceUsdcMicro, evidenceHash);
    }

    function recordDecision(
        bytes32 saleId,
        address auditor,
        bool execute,
        int256 netEdgeBps,
        bytes32 traceHash
    ) external {
        emit DecisionRecorded(saleId, auditor, execute, netEdgeBps, traceHash);
    }
}
