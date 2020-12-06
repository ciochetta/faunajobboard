const express = require("express");

const router = express.Router();

router.use("/skills", require("./skills/routes"));

module.exports = router;
