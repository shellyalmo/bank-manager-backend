import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  getUserBy,
  updateBalance,
} from "../controllers/usersController.js";

// Include other resource routers
const router = express.Router();

router
  .route("/")
  //.get(advancedResults(Shop, "products"), getShops)
  .get(getUsers)
  .post(createUser);

router.route("/getUserBy").get(getUserBy);
router.route("/updateBalance/:id").put(updateBalance);

router.route("/:id").get(getUser).delete(deleteUser);

// .get(getShop).put(updateShop)
export default router;
