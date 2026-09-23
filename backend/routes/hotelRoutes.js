const express = require("express");
const controller = require("../controllers/hotelController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", controller.getHotels);
router.get("/:id", controller.getHotelById);

router.post("/", protect, adminOnly, controller.createHotel);
router.put("/:id", protect, adminOnly, controller.updateHotel);
router.delete("/:id", protect, adminOnly, controller.deleteHotel);

module.exports = router;