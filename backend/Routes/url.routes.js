const express = require("express");
const router = express.Router();

const {shortenUrl}  = require("../Controllers/url.controller");

router.post('/shorten', shortenUrl);


module.exports = router;