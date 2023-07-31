const express = require("express");

const ctrl = require("../../controller/contacts");
const { validateBody, isValidId, authenticate } = require("../../middlewares");

const { joiSchema: schemas } = require("../../schemas/contacts");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, isValidId, ctrl.getById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  ctrl.addContact
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.favoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
