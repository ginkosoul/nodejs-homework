const express = require("express");

const ctrl = require("../../controller/contacts");
const { validateBody, isValidId, authenticate } = require("../../middlewares");

const { joiSchema: schemas } = require("../../schemas/contacts");

const router = express.Router();

router.use(authenticate);

router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

router.delete("/:contactId", isValidId, ctrl.deleteContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addSchema),
  ctrl.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.favoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
