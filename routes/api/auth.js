const express = require("express");
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
} = require("../../controller/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { joiSchema } = require("../../schemas/users");
const { optimize } = require("../../middlewares/optimize");

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
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  optimize,
  updateAvatar
);

module.exports = router;
