const { request, response } = require("express");
const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.get("/", async (request, response) => {
	let companies = await controller.listCompanies();

	return response.status(200).json(companies);
});

router.post("/edit/:id", async (request, response) => {
	const requestCompany = request.body.company;
	const reference = request.params.id;

	const updateResult = await controller.updateCompany(
		requestCompany,
		reference
	);

	response.status(updateResult.Status).json({
		Data: updateResult.Data,
		Message: updateResult.Message,
	});
});

router.post("/new", async (request, response) => {
	let requestCompany = request.body.company;

	let insertionResult = await controller.insertCompany(requestCompany);

	return response.status(insertionResult.Status).json({
		Data: insertionResult.Data,
		Message: insertionResult.Message,
	});
});

module.exports = router;
