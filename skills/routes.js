const { request, response } = require("express");
const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.get("/", async (request, response) => {
	let skills = await controller.listSkills();

	return response.status(200).json(skills);
});

router.post("/edit/:id", async (request, response) => {
	const requestSkill = request.body.skill;
	const reference = request.params.id;

	const updateResult = await controller.updateSkill(requestSkill, reference);

	response.status(updateResult.Status).json({
		Data: updateResult.Data,
		Message: updateResult.Message,
	});
});

router.post("/new", async (request, response) => {
	let requestSkill = request.body.skill;

	let insertionResult = await controller.insertSkill(requestSkill);

	return response.status(insertionResult.Status).json({
		Data: insertionResult.Data,
		Message: insertionResult.Message,
	});
});

module.exports = router;
