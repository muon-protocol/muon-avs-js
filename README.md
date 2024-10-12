# MUON App Engine AVS


An [EigenLayer](https://www.eigenlayer.xyz/) AVS enables developers to create chain-independent decentralized dApps leveraging [MUON network](https://muon.net/).

## Dependencies

1. Install [foundry](https://book.getfoundry.sh/getting-started/installation)
```
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install [docker](https://docs.docker.com/get-docker/)

3. Build the contracts:
```
make build-contracts
```

4. NodeJs
5. Install required modules:
```
npm install
```

> [!TIP]
> This AVS employs the [eigensdk-js](https://github.com/zellular-xyz/eigensdk-js) to facilitate interaction with EigenLayer contracts and to aggregate BLS signatures.

## Running

This simple session illustrates the basic flow of the AVS. The makefile commands are hardcoded for a single operator, but it's however easy to create new operator config files, and start more operators manually (see the actual commands that the makefile calls).

Start anvil in a separate terminal:

```bash
make start-anvil-chain-with-el-and-avs-deployed
```

The above command starts a local anvil chain from a [saved state](./tests/anvil/avs-and-eigenlayer-deployed-anvil-state.json) with eigenlayer and incredible-squaring contracts already deployed (but no operator registered).

Register the operator with eigenlayer and incredible-squaring, and then start the process:

```bash
make start-operator
```

## Usage

**Deploy the MUON app.**

Push the app to [MUON apps repository](https://github.com/muon-protocol/muon-apps/tree/master/general) and ask the MUON team to deploy your app.

Deployed apps will be in [App Engine](./app-engine/apps/layerzero_dvn.js).

Take [LayerZero DVN app](./app-engine/apps/layerzero_dvn.js) as an example.

```bash
curl -g "http://localhost:3000/v1/?app=layerzero_dvn&method=verify&params[jobId]=3&params[network]=ftm"
```

You can use the signatures on-chain/off-chain in order to verify the request.

```yaml
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
```