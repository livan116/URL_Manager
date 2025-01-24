const express = require("express");
const router = express.Router();

const {shortenUrl,redirectUrl}  = require("../Controllers/url.controller");

router.post('/shorten', shortenUrl);
router.get('/:shortUrl',redirectUrl)

module.exports = router;