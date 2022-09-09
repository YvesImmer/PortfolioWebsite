const express = require('express');
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();
const path = require('path');
const { env } = require('process');

const app = express();
const port = process.env.PORT || '3000';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render(
    'index'
    );
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    type: "OAuth2",
    user: "mailerservice.immer@gmail.com",
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
  }
});

transporter.verify(function (error, success){
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
})

app.post("/send", (req, res) => {
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

    const mail = {
      from: data.name,
      to: env.EMAIL,
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.content}`,
    };

    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email sent!");
      }
    })
  })
})