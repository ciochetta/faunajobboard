const express = require("express");

const router = express.Router();

router.use("/skills", require("./skills/routes"));

router.use("/companies", require("./companies/routes"));

router.use("/candidates", require("./candidates/routes"));

module.exports = router;
