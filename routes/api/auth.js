const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
} = require("../../controller/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { joiSchema } = require("../../schemas/users");

const router = express.Router();

router.post("/register", validateBody(joiSchema.registerSchema), register);
router.post("/login", validateBody(joiSchema.loginSchema), login);

router.get("/current", authenticate, getCurrent);
router.get("/logout", authenticate, logout);
router.patch(
  "/",
  authenticate,
  validateBody(joiSchema.subscriptionSchema),
  updateSubscription
);

module.exports = router;
