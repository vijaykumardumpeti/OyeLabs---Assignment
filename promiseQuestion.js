const request = require("request");

// Promisified function
const getGoogleHomePage = () => {
  return new Promise((resolve, reject) => {
    request("http://www.google.com", function (error, response, body) {
      if (error) {
        reject(error);
        console.error("error:", error);
      } else {
        resolve(body);
        console.log(`statusCode: ${response.statusCode}`);
        console.log(`body: ${body}`);
      }
    });
  });
};

// Call the promisified function
getGoogleHomePage()
  .then((response) => {
    console.log(response);
  })
  .catch((e) => {
    console.error(e.message);
  });
