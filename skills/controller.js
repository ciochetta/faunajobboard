const { client, q } = require("../db");

const listSkills = async function () {
	let result = await client.query(
		q.Map(
			q.Paginate(q.Documents(q.Collection("skills"))),
			q.Lambda((x) => q.Get(x))
		)
	);

	const cleanResult = result.data.map(formatSkill);

	return cleanResult;
};

const insertSkill = async function (requestSkill) {
	const validation = validateSkill(requestSkill);

	if (!validation.Valid) {
		return {
			Message: validation.Message,
			Status: validation.Status,
			Data: {},
		};
	}

	let skill = validation.Skill;

	const result = await client.query(
		q.Create(q.Collection("skills"), { data: skill })
	);

	const cleanResult = formatSkill(result);

	return {
		Message: "Skill was created sucessfuly",
		Data: cleanResult,
		Status: 200,
	};
};

const updateSkill = async function (requestSkill, reference) {
	if (reference == undefined || null) {
		return {
			Message: "No id provided",
			Status: 400,
			Data: {},
		};
	}

	validation = validateSkill(requestSkill);

	if (!validation.Valid) {
		return {
			Message: validation.Message,
			Status: validation.Status,
			Data: {},
		};
	}

	skill = validation.Skill;

	let result = await client.query(
		q.Update(q.Ref(q.Collection("skills"), reference), {
			data: {
				name: skill.name,
			},
		})
	);

	const cleanResult = formatSkill(result);

	return {
		Message: "Skill was edited sucessfuly",
		Data: cleanResult,
		Status: 200,
	};
};

const validateSkill = function (unvalidatedSkill) {
	if (unvalidatedSkill == undefined || unvalidatedSkill == null) {
		return {
			Valid: false,
			Message: "Skill is undefined or null",
			Status: 400,
		};
	}

	if (unvalidatedSkill.name == undefined) {
		return {
			Valid: false,
			Message: "Invalid skill, field name not found",
			Status: 400,
		};
	}

	return {
		Valid: true,
		Skill: {
			name: unvalidatedSkill.name.toString(),
		},
	};
};

const formatSkill = function (databaseSkill) {
	return {
		name: databaseSkill.data.name,
		ref: databaseSkill.ref.id,
	};
};

module.exports = {
	listSkills,
	insertSkill,
	updateSkill,
};
