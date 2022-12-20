const express = require("express");
const router = express.Router();

//Controller
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

//auth routes
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

router.route("/").post(userController.createUser);

router.route("/:id").get(userController.getUser);

module.exports = router;
