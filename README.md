
# MUON-AVS-JS - EigenLayer AVS (Offchain Component)

## Overview
**MUON-AVS-JS** is the offchain component of the Muon AVS (Autonomous Verifiable Service) built on top of **EigenLayer**. The purpose of this system is to provide security for applications deployed on the Muon network, ensuring that the operations can be verified securely and trustlessly using threshold signatures (TSS) while utilizing EigenLayer's security primitives. 

## Muon Nodes on EigenLayer
The Muon TSS network is decentralized and secure, eliminating any single point of failure through threshold signatures. However, risks of collusion among subnet nodes can still exist. To mitigate this, we’ve implemented a modular security model that combines proofs from multiple validators.

### Key Features
- **Muon EigenLayer Nodes**: Nodes running the Muon app engine can execute MuonApps, handle requests, and provide their own proofs.
- **Security Modules and Validators**: The security model extends beyond the Muon TSS network and EigenLayer nodes. Projects can also deploy their own Shield nodes or use nodes operated by trusted third parties.

## How It Works Together
1. **MuonApps Deployment**: Projects develop their own MuonApps and deploy them on the Muon Network.
2. **Execution of MuonApps**: MuonApps are executed on multiple nodes (MUON TSS network nodes, EigenLayer nodes, and possibly Shield nodes) as micro validators. These nodes receive requests from users, execute them, and sign the responses.
3. **Verification**: The responses (data) and proofs are verifiable either on-chain or off-chain.
4. **Modular Security Stack**: The security stack is modular, allowing projects to choose verifiers and modules that meet their specific needs.

The off-chain component provides an API endpoint for projects to execute off-chain operations. Once the application is deployed, users can request an application and receive a signature that can be validated either on-chain or off-chain.

## Setup Instructions

1. **Install Dependencies**:
    ```
    npm i
    ```

2. **Setup Environment**:
    ```
    cp .env.example .env
    ```

3. **Register and Start Operato**:
    ```
    make start-operator
    ```

## Usage

1. **Deploying Muon Apps**:
   - Push the app to the MUON Apps repository and request the MUON team to deploy your app.
   - MUON Apps Repository: [Muon Apps GitHub](https://github.com/muon-protocol/muon-apps/tree/master/general)

2. **App Deployment Directory**:
   - Copy the deployed apps into the `app-engine/apps` directory.
   - Configurations are located in the `config-files/` directory.
   - Use the [LayerZero DVN app](./app-engine/apps/layerzero_dvn.js) as an example.

3. **Example Usage Command**:
    ```bash
    curl -g "http://localhost:3000/v1/?app=layerzero_dvn&method=verify&params[jobId]=3&params[network]=ftm"
    ```

4. **Signature Output**:
   The response will include the following output signature:
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

## Additional Notes
- The signatures can be verified either on-chain or off-chain depending on the use case.
- The security model allows for flexibility in combining proofs from different validators.

## License
MIT License. See LICENSE for details.
