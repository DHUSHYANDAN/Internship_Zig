const express = require("express");
const router = express.Router();
const { checkAndFetchSSL, storeManagerAndSendMail } = require("../Controllers.js/controller");

router.post("/fetch-ssl", checkAndFetchSSL);
router.post("/mail-to-sitemanager", storeManagerAndSendMail);

module.exports = router;
