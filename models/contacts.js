const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  if (contacts && Array.isArray(contacts)) return contacts;
  throw Error("No contacts loaded");
};

const getContactById = async (contactId) => {
  const contactList = await listContacts();
  const contact = contactList.find(({ id }) => id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const contactList = await listContacts();
  const index = contactList.findIndex((e) => e.id === contactId);
  if (index === -1) return null;
  const [contact] = contactList.splice(index, 1);
  if (contact)
    await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
  return contact;
};

const addContact = async (body) => {
  const contactList = await listContacts();
  const newContact = { id: nanoid(), ...body };
  contactList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
  return newContact || null;
};

const updateContact = async (contactId, body) => {
  const contactList = await listContacts();
  const index = contactList.findIndex((e) => e.id === contactId);
  if (index === -1) return null;
  contactList[index] = { id: contactId, ...body };
  const contact = contactList[index];
  await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
