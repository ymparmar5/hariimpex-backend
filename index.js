const express = require("express");
const cryptoJS = require("crypto-js");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 8080;

const corsOptions = {
  origin: 'https://hariimpex.in', // Allow requests from this domain
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Define a route handler for the root path "/"
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Handle preflight OPTIONS request for /checkout
app.options("/checkout", cors(corsOptions));

// Define the /checkout POST endpoint
app.post("/checkout", async (req, res) => {
  try {
    const payload = req.body;
    const { base64, finalChecksum } = payload;

    // firebase call to add order x
    console.log(" base64, finalChecksum :>> ", base64, finalChecksum);

    const response = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay", //env
      {
        request: base64,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": finalChecksum,
        },
      }
    );
    res.json(response.data);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`hariimpex listening at http://localhost:${port}`);
});
