const express = require("express");
const router = express.Router();
const auth = require("../Middleware/authMiddleware")

const {shortenUrl,updateUrl,deleteUrl,getInfo,getLinkById}  = require("../Controllers/url.controller");

router.get('/',auth,getInfo)
router.post('/shorten',auth, shortenUrl);
router.put('/:id', auth, updateUrl);
router.delete('/:id', auth, deleteUrl);
router.get('/:id', auth, getLinkById);


module.exports = router;