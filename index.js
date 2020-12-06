const express = require("express");
const body_parser = require("body-parser");

const router = require("./routes");

const app = express();

app.use(body_parser.json());

app.use(router);

app.listen(3000, () => {
	console.log("Server is on");
});
