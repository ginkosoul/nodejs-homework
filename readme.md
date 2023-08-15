# Nodejshw

## Introduction

This project is built on the Express framework and utilizes MongoDB as its database. The Mongoose library is employed to establish a connection with and manage operations on the database. The project is designed to provide robust authentication and authorization features, enabling the management of contacts exclusively for authorized users.

## Features

For routes that accept data (POST and PUT), considered validation of the received data. To validate received data, used the `joi` package. For private routes created middleware `authenticate`. Middleware takes the token from the Authorization headers, checks the token for validity.

### Scripts:

- `npm start` &mdash; production
- `npm run start:dev` &mdash; development

### Models

#### User

```
{
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    }
}
```

#### Contact

```
{
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  }
```

### Routes

#### @ GET /api/contacts

- Gets nothing
- Calls the `listContacts` function to work with the JSON file `contacts.json`
- Returns an array of all contacts in json format with status `200`
- Pagination for the collection of contacts `(GET /api/contacts?page=1&limit=20)`
- Filter contacts by favorite field `(GET /api/contacts?favorite=true)`

#### @ GET /api/contacts/:id

- Doesn't get `body`
- Gets the `id` parameter
- Calls the getById function to work with the contacts.json JSON file
- If there is such an id, returns the contact object in JSON format with status `200`
- If there is no such id, returns json with `{"message": "Not found"}` key and `404` status

#### @ POST /api/contacts

- Gets body in `{name, email, phone}` format (all fields are required)
- If there are no required fields in `body`, returns JSON with key `{"message": "missing required name field"}` and status `400`
- If everything is fine with `body`, add a unique identifier to the contact object
- Calls the addContact(body) function to save the contact in the contacts.json file
- Based on the result of the function, it returns an object with the added `id` `{id, name, email, phone}` and status `201`

#### @ DELETE /api/contacts/:id

- Doesn't get `body`
- Gets the `id` parameter
- Calls the removeContact function to work with the JSON file contacts.json
- If there is such an id, it returns JSON of the format `{"message": "contact deleted"}` with status `200`
- If there is no such id, returns JSON with the key `{"message": "Not found"}` and status `404`

#### @ PUT /api/contacts/:id

- Gets the `id` parameter
- Gets body in JSON format, updating any `name`, `email` and `phone` fields
- If there is no body, returns json with key `{"message": "missing fields"}` and status `400`
- If everything is fine with body, call the updateContact(contactId, body) function (write it) to update the contact in the contacts. json file
- Based on the result of the function, it returns an updated contact object with a status of `200`. Otherwise, returns json with `{"message": "Not found"}` key and `404` status

#### @ PATCH /api/contacts/:contactId/favorite

- Gets the contactId parameter
- Gets body in JSON format with the update of the favorite field
- If there is no body, returns JSON with key `{"message": "missing field favorite"}` and status `400`
- If everything is fine with body, call the updateStatusContact(contactId, body) function (write it) to update the contact in the database
- Based on the result of the function, it returns an updated contact object with a status of 200. - Otherwise, returns JSON with `{"message": "Not found"}` key and `404` status

#### @ POST /api/users/signup

```
# Registration Request
POST /users/signup
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}

# Registration validation error
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Error from Joi or another validation library>

# Registration conflict error
Status: 409 Conflict
Content-Type: application/json
ResponseBody: {
  "message": "Email in use"
}

# Registration success response
Status: 201 Created
Content-Type: application/json
ResponseBody: {
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}
```

#### @ POST /api/users/login

```
# Login request
POST /users/login
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}

# Login validation error
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Error from Joi or another validation library>

# Login success response
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "token": "exampletoken",
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}

# Login auth error
Status: 401 Unauthorized
ResponseBody: {
  "message": "Email or password is wrong"
}
```

#### @ GET /api/users/logout

```
# Logout request
GET /users/logout
Authorization: "Bearer {{token}}"

# Logout unauthorized error
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}

# Logout success response
Status: 204 No Content
```

#### @ GET /api/users/current

```
# Current user request
GET /users/current
Authorization: "Bearer {{token}}"

# Current user unauthorized error
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}

# Current user success response
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "email": "example@example.com",
  "subscription": "starter"
}
```

#### @ PATCH /api/users

```
# Request
GET /users/current
subscription: "['starter', 'pro', 'business']"

# Unauthorized error
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}

# Validation error
Status: 400 Bad request
Content-Type: application/json
ResponseBody: {
    "message": "\"subscription\" must be one of [starter, pro, business]"
}

# Success response
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "email": "example@example.com",
  "subscription": "starter"
}
```

#### @ PATCH /api/users/avatars

```
# Request
PATCH /users/avatars
Content-Type: multipart/form-data
Authorization: "Bearer {{token}}"
RequestBody: uploaded file

# Successful response
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "avatarURL": "image link goes here"
}

# Unsuccessful response
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

#### @ GET /api/users/verify/:verificationToken

```
# Verification request
GET /auth/verify/:verificationToken

# Verification user Not Found
Status: 404 Not Found
ResponseBody: {
  message: 'User not found'
}

# Verification success response
Status: 200 OK
ResponseBody: {
  message: 'Verification successful',
}
```

#### @ POST /api/users/verify/

```
# Resending a email request
POST /users/verify
Content-Type: application/json
RequestBody: {
  "email": "example@example.com"
}

# Resending a email validation error
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Error from Joi or another validation library>

# Resending a email success response
Status: 200 Ok
Content-Type: application/json
ResponseBody: {
  "message": "Verification email sent"
}

# Resend email for verified user
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  message: "Verification has already been passed"
}
```
