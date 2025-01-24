
const express = require("express");
const router = express.Router();

const {redirectUrl}  = require("../Controllers/url.controller");

router.get('/:shortUrl',redirectUrl)


module.exports = router;