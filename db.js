const dotenv = require("dotenv");
dotenv.config();

const faunadb = require("faunadb"),
	q = faunadb.query;

const client = new faunadb.Client({
	secret: process.env.FAUNA_KEY,
});

module.exports = {
	client,
	q,
};
