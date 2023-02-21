const express = require("express");
const { getCarsForm } = require("../controllers/carController");
const router = express.Router();

router.get("/", getCarsForm);

module.exports = router;
