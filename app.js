const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

//bcrypt package is used to create hashable password and able to compare hashable password using hash(), compare() methods
const bcrypt = require("bcrypt");
//jsonwebtoken package jwt.sign(), jwt.verify() methods
const jwt = require("jsonwebtoken");

const path = require("path");

const app = express();

//middleware function it will ensure/helps in a way that the app uses the JSON as request and gives JSON as request
app.use(express.json());

//initialize DB and Start the server(for database connection object)

let dataBase;

const initializeDBAndServer = async () => {
  try {
    //getting connection object
    dataBase = await open({
      filename: path.join(__dirname, "database.db"),
      driver: sqlite3.Database,
    });

    //starting the server
    app.listen(3000, () => {
      console.log("Server is running on https://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeDBAndServer();

//login API {userName, password}

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  //validate input fields
  if (username === "" || password === "") {
    response.status(400);
    response.send("Username or password must have non empty");
  } else {
    //validate password and send jwt by using username or password
    const checkUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
    //checking whether the user exists or not
    const dbUserExist = await dataBase.get(checkUserQuery);
    if (dbUserExist !== undefined) {
      const checkPassword = await bcrypt.compare(
        password,
        dbUserExist.password
      );
      //if the user doesn't exist then check for the password
      //if the password matches then send the jwtToken object as a response else send error message & code
      if (checkPassword === true) {
        const payload = { username: username };
        const jwtToken = jwt.sign(payload, "jwt_token");
        response.status(200);
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid password");
      }
    } else {
      response.status(400);
      response.send("Invalid user");
    }
  }
});

//adding customer API {name, userName, email}
app.post("/customers/", async (request, response) => {
  const { name, phoneNumber, email } = request.body;

  //validate input fields
  if (name === "" || phoneNumber === "" || email === "") {
    response.send("input fields shouldn't be an empty");
  } else {
    //checking for phone number, should have 10 digits without having 0 at the starting of the phone number
    if (
      phoneNumber.length !== 10 &&
      (phoneNumber.slice(0, 1) !== 0 || phoneNumber.slice(0, 1) !== "0")
    ) {
      response.send("phone number must have 10 digits without 0 at starting");
    } else {
      //add the customer to customers table, make sure that customer didn't exists in the table
      const checkUser = `select * from customers where phone_number = '${phoneNumber}';`;

      const dbUser = await dataBase.get(checkUser);
      //checking customer exists or not
      if (dbUser !== undefined) {
        response.status(400);
        response.send("customer already exists");
      } else {
        //adding new customer to customers table
        const requestQuery = `insert into customers (name, phone_number, email) values(
            '${name}', '${phoneNumber}', '${email}'
        );`;
        await dataBase.run(requestQuery);
        response.status(200);
        response.send("customer added successfully");
      }
    }
  }
});
