import express from "express";
import { getUsers, createUser } from "../controllers/usersController.js";
// import advancedResults from "../middleware/advancedResults.js";
// import User from "../models/User.js";

// Include other resource routers
const router = express.Router();

router
  .route("/")
  //.get(advancedResults(Shop, "products"), getShops)
  .get(getUsers)
  .post(createUser);

router.route("/:id").get(getShop).put(updateShop).delete(deleteShop);

export default router;
