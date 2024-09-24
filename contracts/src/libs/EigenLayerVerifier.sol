// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

library EigenLayerVerifier {
    using ECDSA for bytes32;

    function verifyOperatorSig(
        bytes32 hash,
        address operator,
        bytes calldata signature
    ) internal pure returns (bool) {
        hash = hash.toEthSignedMessageHash();
        address signatureSigner = hash.recover(signature);

        bool verified = signatureSigner == operator;
        return verified;
    }
}
