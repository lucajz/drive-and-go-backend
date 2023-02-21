const express = require("express");
const { patchHotCar, getHotCar } = require("../controllers/carController");
const router = express.Router();

router.patch("/:slug", patchHotCar);
router.get("/", getHotCar);

module.exports = router;
