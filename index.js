const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 8080;

const allowedOrigins = [
  "https://hariimpex-opal.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-VERIFY"],
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
    const { base64, checksum } = payload;

    // Firebase call to add order x
    console.log("Payload base64:", base64);
    console.log("Checksum:", checksum);

    const response = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay", // Environment URL
      { request: base64 },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error during payment processing:", error);
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`hariimpex listening at http://localhost:${port}`);
});
