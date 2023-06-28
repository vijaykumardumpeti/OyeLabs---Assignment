const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "thirdQuestion.db");

let dataBase;
const initializeDBAndServer = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is running on https://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB ERROR: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer().then(() => {
  const customers = [
    {
      email: "anurag11@yopmail.com",
      name: "anurag",
    },
    {
      email: "sameer11@yopmail.com",
      name: "sameer",
    },
    {
      email: "ravi11@yopmail.com",
      name: "ravi",
    },
    {
      email: "akash11@yopmail.com",
      name: "akash",
    },
    {
      email: "anjali11@yopmail.com",
      name: "anjai",
    },
    {
      email: "santosh11@yopmail.com",
      name: "santosh",
    },
  ];

  const addData = async (customers) => {
    for (const eachCustomer of customers) {
      const { email, name } = eachCustomer;

      //ensure whether the mail exists or not
      const checkMail = `SELECT * FROM customers WHERE email = '${email}'`;
      const dataBaseMail = await dataBase.get(checkMail);

      if (dataBaseMail === undefined) {
        const addCustomerQuery = `INSERT INTO customers (name, email) VALUES ('${name}', '${email}')`;
        await dataBase.run(addCustomerQuery);
      } else {
        const updateNameQuery = `UPDATE customers SET name = '${name}' WHERE email = '${email}'`;
        await dataBase.run(updateNameQuery);
      }
    }

    const getUpdatedData = `SELECT * FROM customers`;
    const updatedTable = await dataBase.all(getUpdatedData);
    console.log(updatedTable);
  };

  addData(customers);
});
