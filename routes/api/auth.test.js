const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");

const app = require("../../app");

const User = require("../../models/user");

const { DB_TEST, PORT } = process.env;

describe("test routes", () => {
  let server = null;
  beforeAll(async () => {
    server = app.listen(PORT);
    await mongoose.connect(DB_TEST);
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  beforeEach(() => {});

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test login route", async () => {
    const password = await bcrypt.hash("123456", 10);

    const newUser = {
      name: "John",
      email: "john@gmail.com",
      password,
      avatarURL: "avatars/64c7c0b799533ae21116f6b0_Frame 868.jpg",
    };

    const user = await User.create(newUser);

    const loginUser = {
      email: "john@gmail.com",
      password: "123456",
    };

    const res = await request(app).post("/api/users/login").send(loginUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    const { token } = await User.findById(user._id);
    expect(res.body.token).toBe(token);
  });

  test("test register route with correct data", async () => {
    const registerData = {
      //   subscription: "pro",
      email: "emily@mail.com",
      password: "123456",
    };

    const res = await request(app)
      .post("/api/users/register")
      .send(registerData);

    expect(res.statusCode).toBe(201);

    expect(res.body.email).toBe(registerData.email);
    expect(typeof res.body.email).toBe("string");

    expect(res.body.subscription).toBeTruthy();
    expect(typeof res.body.subscription).toBe("string");
  });
});
