const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

// Whitelisted domains
const allowedOrigins = [
  "https://hariimpex-opal.vercel.app",
  "http://localhost:5173",
  "https://hariimpex.in",
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-VERIFY"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from HariImpex backend!");
});

// Optional: handle preflight (though `app.use(cors())` usually covers this)
app.options("/checkout", cors(corsOptions));

// Payment processing endpoint
app.post("/checkout", async (req, res) => {
  try {
    const { base64, checksum } = req.body;

    if (!base64 || !checksum) {
      return res.status(400).json({ error: "Missing base64 or checksum" });
    }

    const response = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      { request: base64 },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Payment processing failed:", error.response?.data || error.message);
    res.status(500).json({
      error: "Payment processing failed",
      details: error.response?.data || error.message,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`HariImpex backend running at http://localhost:${port}`);
});
