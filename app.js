const express = require("express");
const request = require("request");
const https = require("https")
const client = require("@mailchimp/mailchimp_marketing");
const { API_KEY, AUDIENCE_ID } = require('./keys');

const apiKey = "878ff5e7a67f1c7e41565830d44470ac-us13";
const audienceId = "e27b5c95cb";

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: API_KEY,
  server: "us13",
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
    try {
      const response = await client.lists.addListMember(AUDIENCE_ID, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      console.log(err.message);
      res.sendFile(__dirname + "/failure.html");
    }
  };

  run();
});

    app.post("/failure", function(req, res) {
      res.redirect("/");
    });


    app.listen(process.env.PORT || 3000, function() {
      console.log("Server is running on port 3000.");
    });
