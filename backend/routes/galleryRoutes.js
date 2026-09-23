const express = require("express");
const controller = require("../controllers/galleryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", controller.getGalleryItems);
router.post("/", protect, adminOnly, controller.createGalleryItem);
router.delete("/:id", protect, adminOnly, controller.deleteGalleryItem);

module.exports = router;
