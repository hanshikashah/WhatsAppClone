// Import required modules
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbmessages.js";
import Pusher from "pusher";
import cors from "cors";
// Create an Express application

/*const app = express(); is a common way to set up an Express web application. 
It creates an instance of Express that allows you to define routes, apply middleware,
 and start an HTTP server to handle incoming requests and send responses.
 It's the core object for building web applications and APIs in Node.js.*/
const app = express();
//pusher treated as middle between frontend and backend
const pusher = new Pusher({
  appId: "1700512",
  key: "f0c3fd2105ed94373305",
  secret: "0e004c0e6f8bdc3d1e20",
  cluster: "ap2",
  useTLS: true,
});
// Define the port the server should listen on, using the environment variable PORT or default to 8000
const port = process.env.PORT || 8000;

//middleware
//Enables JSON request body parsing in an Express application.
app.use(express.json());
app.use(cors());
// sets up CORS (Cross-Origin Resource Sharing) headers in an Express application to allow all origins and headers for incoming requests.
//It allows web pages from different origins (domains) to make requests to your server.

// Define the connection URL for MongoDB
const connection_url =
  "mongodb+srv://admin:8jPB7YuTHYhgJjqv@whatsapp-cluster.rdoxcj5.mongodb.net/whatsappdb=true&w=majority";

// Connect to the MongoDB database
mongoose.connect(connection_url);

const db = mongoose.connection;
db.once("open", () => {
  console.log("db connected");

  const msgCollection = db.collection("messagecontents");
  //A change stream allows you to listen for changes in a collection, such as inserts, updates, or deletes.
  //This is useful for implementing real-time messaging features in your application.
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    console.log("A change occurred", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

// Define a route for the root URL
app.get("/", (req, res) => res.status(200).send("Hello, world!"));
app.get("/messages/sync", (req, res) => {
  // Get the message data from the request body
  const dbMessage = req.body;

  // Create a new message in the MongoDB database using Promises
  Messages.create(dbMessage)
    .then((data) => {
      // If the message creation is successful, send a 201 (Created) status with the message data
      res.status(201).send(data);
    })
    .catch((err) => {
      // If there is an error during message creation, send a 500 (Internal Server Error) status with the error message
      res.status(500).send(err);
    });
});

// Define a route for creating new messages
app.post("/messages/new", (req, res) => {
  // Get the message data from the request body
  const dbMessage = req.body;

  // Create a new message in the MongoDB database using Promises
  Messages.create(dbMessage)
    .then((data) => {
      // If the message creation is successful, send a 201 (Created) status with the message data
      res.status(201).send(data);
    })
    .catch((err) => {
      // If there is an error during message creation, send a 500 (Internal Server Error) status with the error message
      res.status(500).send(err);
    });
});

// Start the Express server and listen on the defined port
app.listen(port, () => console.log(`Listening on http://localhost: ${port}`));
//3:18:22 timestamp
