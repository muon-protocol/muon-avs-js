// const path = require("path");
// require("dotenv").config({path: path.resolve(process.cwd(), '../.env')});
const express = require("express");
const axios = require("axios");
const cors = require('cors');
axios.defaults.headers.post["accept-encoding"] = "";
const bodyParser = require("body-parser");
const PORT = process.env.SERVER_PORT || 3000;
const SHIELD_FORWARD_URLS = process.env.SHIELD_FORWARD_URLS;
const FEE_PK = process.env.FEE_PRIVATE_KEY;
const { confirmResponse, muonFeeSignature } = require("./utils/helpers");
global.MuonAppUtils = require("./app-utils");

const originalForwardUrls = SHIELD_FORWARD_URLS.split(",");
let forwardUrls = originalForwardUrls;

const router = express();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors({
  origin: '*'
}));

router.get("/", (req, res) => {
  res.json({ message: "App Engine Node" });
});

router.use("*", async (req, res, next) => {
  let mixed = {
    ...req.query,
    ...req.body,
  };
  let {
    app,
    method,
    fee = {},
    params = {},
    nSign,
    mode = "sign",
    gwSign,
  } = mixed;

  if (!["sign", "view"].includes(mode)) {
    res.json({
      success: false,
      error: { message: "Request mode is invalid" },
    });
  }

  gwSign = false; // do not allow gwSign for shiled nodes

  // TODO: Implement user authentication and rate limiting for each project.
  // This will prevent attackers from sending multiple requests and depleting the fees
  if (FEE_PK) {
    fee = muonFeeSignature(FEE_PK, process.env.FEE_APP_ID);
  }
  
  let requestData = { app, method, params, nSign, mode, gwSign };
  if (fee && fee.spender) {
    requestData["fee"] = fee;
  }
  
  if (forwardUrls.length == 0) forwardUrls = originalForwardUrls;

  let forwardUrl = forwardUrls[0];

  const result = await axios
    .post(forwardUrl, requestData)
    .then(({ data }) => data)
    .catch((error) => {
      if (error.code === "ECONNREFUSED" || error.code === "ECONNABORTED")
        forwardUrls.shift();
      res.json({
        success: false,
        error,
      });
    });

  if(!result) {
    return;
  }

  if (!result.success) {
    res.json(result);
  } else {
    try {
      await confirmResponse(requestData, result.result);
      req.gatewayResponse = result;
      return next();
    } catch (ex) {
      console.log(ex);
      res.json({
        success: false,
        error: ex,
      });
    }
  }
});

module.exports = {
  router,
  start: () => {
    router.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });    
  }
}