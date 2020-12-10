const { request, response } = require("express");
const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.get("/", async (request, response) => {
	let candidates = await controller.listCandidates();

	return response.status(200).json(candidates);
});

router.post("/edit/:id", async (request, response) => {
	const requestCandidate = request.body.candidate;
	const reference = request.params.id;

	const updateResult = await controller.updateCandidate(
		requestCandidate,
		reference
	);

	response.status(updateResult.Status).json({
		Data: updateResult.Data,
		Message: updateResult.Message,
	});
});

router.post("/new", async (request, response) => {
	let requestCandidate = request.body.candidate;

	let insertionResult = await controller.insertCandidate(requestCandidate);

	return response.status(insertionResult.Status).json({
		Data: insertionResult.Data,
		Message: insertionResult.Message,
	});
});

module.exports = router;
