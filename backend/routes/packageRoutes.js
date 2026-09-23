const express = require("express");
const controller = require("../controllers/packageController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/featured", controller.getFeaturedPackages);
router.get("/", controller.getPackages);
router.get("/:id", controller.getPackageById);

router.post("/", protect, adminOnly, controller.createPackage);
router.put("/:id", protect, adminOnly, controller.updatePackage);
router.delete("/:id", protect, adminOnly, controller.deletePackage);

module.exports = router;