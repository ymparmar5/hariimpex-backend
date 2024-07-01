const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 8080;

const corsOptions = {
  origin: 'https://hariimpex-opal.vercel.app/', // Allow requests from this domain
  methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'X-VERIFY'], // Allow these headers
  optionsSuccessStatus: 200, // For legacy browser support
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

    // Firebase call to add order x
    console.log("base64, finalChecksum :>> ", base64, finalChecksum);

    const response = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay", // Environment URL
      { request: base64 },
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
