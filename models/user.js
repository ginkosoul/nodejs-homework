const { model } = require("mongoose");

const { mongooseSchema } = require("../schemas/users");
const handleMongooseError = require("../middlewares/handleMongooseError");

mongooseSchema.post("save", handleMongooseError);

const User = model("user", mongooseSchema);

module.exports = User;
