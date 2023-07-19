const { model } = require("mongoose");
const { handleMongooseError } = require("../middlewares");
const { mongooseSchema: contactSchema } = require("../schemas/contacts");

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

module.exports = Contact;
