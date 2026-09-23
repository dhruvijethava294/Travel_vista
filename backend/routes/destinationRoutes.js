const express = require("express");
const controller = require("../controllers/destinationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", controller.getDestinations);
router.get("/:id", controller.getDestinationById);

router.post("/", protect, adminOnly, controller.createDestination);
router.put("/:id", protect, adminOnly, controller.updateDestination);
router.delete("/:id", protect, adminOnly, controller.deleteDestination);

module.exports = router;
