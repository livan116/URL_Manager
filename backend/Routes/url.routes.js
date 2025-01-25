const express = require("express");
const router = express.Router();
const auth = require("../Middleware/authMiddleware")

const {shortenUrl}  = require("../Controllers/url.controller");

router.post('/shorten',auth, shortenUrl);


module.exports = router;