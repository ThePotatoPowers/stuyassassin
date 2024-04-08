const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const { parse } = require("csv-parse");
const xlsx = require('node-xlsx');

const PORT = 5500;
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", function(req, res)  {
    res.sendFile(__dirname + "/public/index.html");
});


app.post("/auth", async (req, res) => {


  //console.log("got here!0")
  //console.log(req.body);
  try {

    // get the web client id from client.json
    const webID = "388312483979-0f6hup9b4bn8pg1hc98rum4dcsov3qh2.apps.googleusercontent.com"
    const client = new OAuth2Client(webID);
    const ticket = await client.verifyIdToken({ 
      idToken: req.body.id_token,
      audience: webID,
    });
    const payload = ticket.getPayload();
    const stuy = payload['hd'];
    const email = payload['email'];
    const userid = payload['sub'];
    const name = payload['name'];
    console.log(`User authenticated with id: ${userid}`);

    const allInfo = {
        name: name,
        stuy: stuy,
        email: email,
    }

    res.status(200).json({allInfo});
  } catch (err) {
    
    console.log("Invalid ID Token");
    console.log(err);
  }
});


app.post("/target", async (req, res) => {

    console.log("got to target");
  //console.log("got here!0")
  //console.log(req.body);
  try {

    // get the web client id from client.json
    const email = req.body.email;
    console.log(email);
    // go through the csv file to find whoever email's target is
    const data = fs.readFileSync("pairs.csv");
    const target_file = xlsx.parse(data);
    //console.log(target_file);

    // get the target
    let email_target = "";
    for (let i = 0; i < target_file[0].data.length; i++) {
        if (target_file[0].data[i][0] === email) {
            email_target = target_file[0].data[i][1];
            break;
        }
    }






    const targets = {
        target: email_target
    };

    res.status(200).json({targets});
  } catch (err) {
    
    console.log("Invalid ID Token");
    console.log(err);
  }
});
