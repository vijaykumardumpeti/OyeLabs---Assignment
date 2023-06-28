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
      filename: path.join(__dirname, "databaseForSubjects.db"),
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

app.get("/get-subjects/", async (request, response) => {
  //getting subjects of each customer
  const queryForSubjects = `SELECT customers.customerId, customers.name, GROUP_CONCAT(subject.subjectName, ',') AS subjects
        FROM customers 
        JOIN subjects_student_mapping m ON c.customerId = m.customerId
        JOIN subjects s ON m.subjectId = s.subjectId
        GROUP BY c.customerId, c.name
        ORDER BY c.name ASC;
        `;
  const data = await dataBase.all(queryForSubjects);
  response.status(200);
  response.send(data);
});

/*
CREATE TABLE subjects_student_mapping
(
    mappingId NOT NULL PRIMARY KEY,
    customerId INTEGER,
    subjectId INTEGER, 
    FOREIGN KEY(customerId) REFERENCES customer (customerId) ON DELETE CASCADE,
    FOREIGN KEY(subjectId) REFERENCES subjects (subjectId) ON DELETE CASCADE
);

CREATE TABLE subjects_student_mapping(mappingId INTEGER NOT NULL PRIMARY KEY,customerId INTEGER,subjectId INTEGER, FOREIGN KEY(customerId) REFERENCES customer (customerId) ON DELETE CASCADE,FOREIGN KEY(subjectId) REFERENCES subjects (subjectId) ON DELETE CASCADE);



INSERT INTO customers (customerId, name, email) VALUES (1, 'ravi', 'ravi1232gmail.com'),(2, 'kishan', 'kishan11@gmail.com'),(3, 'sameer', 'sameer44@gmail.com');

INSERT INTO subjects (subjectId, subjectName) VALUES(1, 'English'),(2, 'Hindi' ),(3, 'Maths');
INSERT INTO subjects_student_mapping (customerId, customerId, subjectId) VALUES(1, 1,1),(2,1, 2),(3,1,3),(4,2,1),(5,3,3),(6,3,1);

ALTER TABLE subjects_student_mapping ADD mappingId INTEGER;

ALTER TABLE subjects_student_mapping DROP COLUMN mappingId;


*/
