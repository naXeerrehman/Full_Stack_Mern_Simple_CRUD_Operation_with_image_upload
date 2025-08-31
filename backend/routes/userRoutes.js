import express from "express";
import {
  create_user,
  get_users,
  get_user_by_id,
  update_user,
  delete_user,
} from "../controllers/userCrud.js";

import { uploadImages, resizeImages } from "../Middlewares/image_upload.js";

const router = express.Router();

// Route to create a new item with images
router.post("/create_user", uploadImages, resizeImages,create_user);

// Route to get all item
router.get("/get_users", get_users);

// Route to get a item by ID
router.get("/get_user/:id", get_user_by_id);

// Route to update a item
router.put("/update_user/:id", uploadImages, resizeImages, update_user);

// Route to delete a item by ID
router.delete("/delete_user/:id", delete_user);

export default router;
