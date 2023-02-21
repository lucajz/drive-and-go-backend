const express = require("express");
const {
  addCar,
  getCars,
  updateCar,
  deleteCar,
  getCar,
  patchHotCar,
  getHotCar,
  getCarsForm,
} = require("../controllers/carController");
const protect = require("../Middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

router.get("/", getCars);
router.post("/", protect, upload.array("imgs"), addCar);
router.patch("/:slug", protect, upload.array("imgs"), updateCar);
router.delete("/:slug", protect, deleteCar);
router.get("/:slug", getCar);

module.exports = router;
