const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// for handling forms submissions
app.use(express.urlencoded({ extended: false }));

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));
//Body parser middleware to handle json in request body
app.use(express.json());
// Setting up Auth0
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://karem-jouini.auth0.com/.well-known/jwks.json"
  }),
  audience: "http://localhost:5001/",
  issuer: "https://karem-jouini.auth0.com/",
  algorithms: ["RS256"]
});

app.use(jwtCheck);

// /authorized added to api's route to secure it

app.use("/authorized/api/ads", require("./src/api/ads"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log("Server IS LISTENING ON ", PORT));
