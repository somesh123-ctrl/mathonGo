const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const csvParser = require("csv-parser");

const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { ObjectId } = mongoose.Types;

const app = express();
app.use(bodyParser.json());

dotenv.config();
app.use(cors());

mongoose.connect("mongodb://localhost:27017/emailListApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const listSchema = new mongoose.Schema({
  title: String,
  customProperties: [{ title: String, fallback: String }],
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  properties: Map,
});

const List = mongoose.model("List", listSchema);
const User = mongoose.model("User", userSchema);

const upload = multer({ dest: "uploads/" });

app.post("/lists", async (req, res) => {
  const { title, customProperties } = req.body;

  if (!title || !customProperties) {
    return res.status(400).send("Title and custom properties are required.");
  }

  const list = new List({ title, customProperties });
  await list.save();

  res.status(201).send(list);
});

app.post("/lists/:id/users", upload.single("file"), async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid list ID.");
  }

  const list = await List.findById(id);
  if (!list) {
    return res.status(404).send("List not found.");
  }

  const usersToAdd = [];
  const errors = [];
  const existingEmails = new Set(await User.find({}).distinct("email"));

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (row) => {
      const { name, email, ...props } = row;
      if (!name || !email) {
        errors.push({ row, error: "Name and email are required." });
        return;
      }
      if (existingEmails.has(email)) {
        errors.push({ row, error: "Email already exists." });
        return;
      }

      const userProps = new Map();
      list.customProperties.forEach(({ title, fallback }) => {
        userProps.set(title, props[title] || fallback);
      });

      usersToAdd.push({ name, email, properties: userProps });
      existingEmails.add(email);
    })
    .on("end", async () => {
      try {
        await User.insertMany(usersToAdd);
        fs.unlinkSync(req.file.path);
        res.send({
          successCount: usersToAdd.length,
          errorCount: errors.length,
          errors,
        });
      } catch (e) {
        res.status(500).send("Error adding users.");
      }
    });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "demo1email2for3project@gmail.com",
    pass: "hpaa abyu tssh axvf",
  },
});

app.post("/lists/:id/send-email", async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid list ID.");
  }

  const { subject, body } = req.body;

  const list = await List.findById(id);
  const users = await User.find({});

  if (!list || !subject || !body) {
    return res.status(400).send("List, subject, and body are required.");
  }

  users.forEach((user) => {
    let emailBody = body;
    user.properties.forEach((value, key) => {
      const regex = new RegExp(`\\[${key}\\]`, "g");
      emailBody = emailBody.replace(regex, value);
    });

    const mailOptions = {
      from: "demo1email2for3project@gmail.com",
      to: user.email,
      subject,
      text: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });

  res.send("Emails sent.");
});

app.post("/unsubscribe", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("User not found.");
  }

  await User.deleteOne({ email });
  res.send("Unsubscribed successfully.");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
