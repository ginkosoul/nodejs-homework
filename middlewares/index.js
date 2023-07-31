const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const handleMongooseError = require("./handleMongooseError");
const authenticate = require("./authenticate");

// console.log("Index", handleMongooseError);

module.exports = {
  validateBody,
  isValidId,
  handleMongooseError,
  authenticate,
};
