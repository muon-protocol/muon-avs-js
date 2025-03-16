import "dotenv/config";
import * as fs from "fs";
import Web3, { eth as web3Eth } from "web3";
import pino from "pino";

const { soliditySha3 } = require("./app-engine/app-utils/index.js");
const gateway = require("./app-engine/server.js");

const logger = pino({
  level: "info", // Set log level here
  // prettyPrint: { colorize: true }
  transport: {
    target: "pino-pretty",
  },
});

class MuonAVSOperator {
  private signingEcdsaPrivateKey?: string;
  private signing_address?: string;

  constructor() {}

  async init() {
    await this.loadEcdsaKey();
    logger.info("ECDSA key loaded.");
  }

  public async start(): Promise<void> {
    logger.info("Starting Operator...");
    gateway.router.use((req: any, res: any, next: any) => {
      const { gatewayResponse } = req;
      if (gatewayResponse.success) {
        gatewayResponse.result.eigenlayer =
          this.processSignature(gatewayResponse);
        res.json(gatewayResponse);
      }
      next();
    });
    return new Promise((resolve: any, reject: any) => gateway.start(logger));
  }

  public processSignature(gatewayResponse: any): any {
    const { result } = gatewayResponse;
    logger.info(result);
    let hashToBeSigned = soliditySha3(result.data.signParams);
    const signature = web3Eth.accounts.sign(
      hashToBeSigned!,
      this.signingEcdsaPrivateKey!
    );
    logger.info(`Operator signature: ${signature.signature}`);
    const data = {
      signature: signature.signature,
      operator_address: this.signing_address,
    };
    return data;
  }

  private async loadEcdsaKey(): Promise<void> {
    const ecdsaKeyPassword: string | undefined = process.env.KEY_PASSWORD || "";
    if (!ecdsaKeyPassword) {
      logger.warn("KEY_PASSWORD not set. using empty string.");
    }

    const keystore: any = JSON.parse(
      fs.readFileSync(process.env.SIGNING_ECDSA_KEY_PATH!, "utf8")
    );
    const web3 = new Web3();
    const account = await web3.eth.accounts.decrypt(keystore, ecdsaKeyPassword);
    this.signingEcdsaPrivateKey = account.privateKey;
    logger.info(`AVS siging key address: ${account.address}`);
    this.signing_address = account.address;
  }
}

async function main() {
  const operator = new MuonAVSOperator();
  await operator.init();
  return operator.start();
}

main()
  .catch((e) => console.dir(e, { depth: 6 }))
  .finally(() => {
    process.exit(0);
  });
