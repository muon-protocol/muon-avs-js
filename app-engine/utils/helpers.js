const soliditySha3 = require("../app-utils/utils/soliditySha3");
const crypto = require("../app-utils/utils/crypto");
const {Web3} = require("web3");
const ethSigUtil = require("@metamask/eth-sig-util");

const web3 = new Web3();



function moduleIsAvailable(path) {
  try {
    require.resolve(path);
    return true;
  } catch (e) {
    return false;
  }
}

async function runMounApp(request, appResponse) {
  const { app, method, params = {} } = request;
  let appPath = `../apps/${app}.js`;

  if (!moduleIsAvailable(appPath)) {
    throw { message: `App not found on shield node` };
  }

  //TODO: set dynamic params(APP_ID, APP_CID, ...)
  let muonApp = require(appPath);
  let newRequest = {
    app,
    method,
    data: {
      params,
      timestamp: appResponse.startedAt,
      result: appResponse.data.result,
    },
  };

  let result = await muonApp.onRequest(newRequest);

  const appSignParams = muonApp.signParams(newRequest, result);
  return appSignParams;
}

async function confirmResponse(requestData, appResponse) {
  // response hash without appId and reqId
  const responseHash = soliditySha3(appResponse.data.signParams.slice(2));
  // appResponse.shieldAddress = process.env.SIGN_WALLET_ADDRESS;

  const appSignParams = await runMounApp(requestData, appResponse);
  const shieldHash = soliditySha3(appSignParams);

  // TODO: this does not work for non-deterministic apps
  // for example price feeds.
  if (shieldHash != responseHash) {
    throw { message: `Shield node confirmation failed` };
  }

  // sha3 of all of the parameters
  // let hashToBeSigned = soliditySha3(appResponse.data.signParams);
  // let cryptoSign = crypto.sign(hashToBeSigned);
  // appResponse.shieldSignature = cryptoSign;
  // appResponse.nodeSignature = cryptoSign;
}

function muonFeeSignature(PK, appId) {
  let timestamp = Math.floor(Date.now());
  let wallet = web3.eth.accounts.privateKeyToAccount(PK);

  const address = wallet.address;
  const privateKey = wallet.privateKey.substr(2);

  let eip712TypedData = {
    types: {
      EIP712Domain: [{ name: "name", type: "string" }],
      Message: [
        { type: "address", name: "address" },
        { type: "uint64", name: "timestamp" },
        { type: "uint256", name: "appId" },
      ],
    },
    domain: { name: "Muonize" },
    primaryType: "Message",
    message: { address: address, timestamp, appId },
  };
  const sign = ethSigUtil.signTypedData({
    privateKey: privateKey,
    data: eip712TypedData,
    version: ethSigUtil.SignTypedDataVersion.V4,
  });

  return {
    spender: wallet.address,
    timestamp,
    signature: sign    
  }
}

module.exports = {
  confirmResponse,
  muonFeeSignature
};
