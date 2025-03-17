
# MuonAVS (Offchain Component)

## Overview

This repository is the off-chain component of the Muon AVS, a key security layer of Muon that runs MuonApps on EigenLayer nodes.  
Muon is a general-purpose validation layer for Web3. DApps can run essential components as MuonApps, acting as micro-validators on the Muon Network and Muon AVS. These micro-validators enable DApps to validate data and generate proofs that can be verified on any blockchain or off-chain component.

## Setup Instructions

1. **Install Dependencies**:
    ```
    npm i
    ```

2. **Setup Environment**:
    ```
    cp .env.example .env
    ```
    > **Note:** Set the `SIGNING_ECDSA_KEY_PATH` variable in the `.env` file to specify the path of the key file.
3. **Start Operator**:
    ```
    KEY_PASSWORD=<key-password> pm2 start npm -- run operator
    ```
    > **Tip:** You can ignore the `KEY_PASSWORD` variable if the key file is not encrypted or if you have used an empty password.
4. **Allow External Access to the Micro Validator Service**:  
    Check with the team to make the microservice public.

## Usage
The Micro Validator Engine runs as a web service on port `3000` by default. You can send requests to various MuonApps to retrieve response and signatures.  
For example, you can use the [EVM Verifier MuonApp](./app-engine/apps/evm_data_verifier.js)] to fetch data from EVM chains, validate it, and generate signatures. This App can be useful for interchain protocols, bridges, and more.

**Sample Request**:  
```bash
    curl -g "http://localhost:3000/v1/?app=evm_data_verifier&method=get-block&params[network]=bsc&params[block]=47516590"
```


**Sample Signatures in the Response**:    
    
```json
    {
        "signatures": [
            {
                "owner": "0x9bE8ee25aA0EE1a2c7bD6A580c0734E7D4033389",
                "ownerPubKey": {
                    "x": "0x25ee4bc28f38b61b1a0036dc08084300c0b8a423c4da17911a2ba4d9e845c2e5",
                    "yParity": "1"
                },
                "signature": "0x92d666729e7f66188c9fd2a7e4e9d8522d472393139fd4366644c7ec3906578c"
            }
        ],
        "eigenlayer": {
            "signature": "0x1b3fbae4020500b59ea8baba6e590ef8bb081489310d96e19d7aa09c4874f83000be09a89c97d2072555cd5f47d2a2637ec773f5094a2c040e33600ac425606e1b",
            "operator_id": "0xc4c210300e28ab4ba70b7fbb0efa557d2a2a5f1fbfa6f856e4cf3e9d766a21dc",
            "operator_address": "0x860B6912C2d0337ef05bbC89b0C2CB6CbAEAB4A5"
        }
    }
```
  
See the full response [here](http://3.136.59.242:8012/v1/?app=evm_data_verifier&method=get-block&params[network]=bsc&params[block]=47516590)

## Additional Notes
Muon AVS operators can choose the MuonApps and micro-validators they wish to support. For more information, the Muon team is available to connect with operators.
## License
MIT License. See LICENSE for details.
