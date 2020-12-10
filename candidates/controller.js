const { client, q } = require("../db");

const { bulkInsertSkills } = require("../skills/controller");

const insertCandidate = async function (requestCandidate) {
	const requestValidation = validateCandidateRequest(requestCandidate);

	if (!requestValidation.Valid) {
		return {
			Message: requestValidation.Message,
			Status: requestValidation.Status,
			Data: {},
		};
	}

	let validatedCandidate = requestValidation.Candidate;

	if (validatedCandidate.skills !== undefined) {
		const candidateDbSkills = (
			await bulkInsertSkills(validatedCandidate.skills)
		).Data;

		const formattedSkills = candidateDbSkills.map((dbSkill) => {
			return {
				experience: validatedCandidate.skills.find((cSkill) => {
					return cSkill.name.toLowerCase() === dbSkill.name.toLowerCase();
				}).experience,
				ref: q.Ref(q.Collection("skills"), dbSkill.ref),
			};
		});

		validatedCandidate.skills = formattedSkills;
	}

	const insertResult = await client.query(
		q.Create(q.Collection("candidates"), { data: validatedCandidate })
	);

	return {
		Status: 200,
		Data: insertResult,
		Message: "",
	};
};

const listCandidates = async function () {};

const updateCandidate = async function (requestCandidate, reference) {};

const getCandidate = async function (reference) {};

const validateCandidateRequest = function (unvalidatedCandidateRequest) {
	if (unvalidatedCandidateRequest === null || undefined) {
		return {
			Valid: false,
			Message: "Candidate is undefined or null",
			Status: 400,
		};
	}

	if (unvalidatedCandidateRequest.name === undefined) {
		return {
			Valid: false,
			Message: "Invalid candidate, field name not found",
			Status: 400,
		};
	}

	if (unvalidatedCandidateRequest.email === undefined) {
		return {
			Valid: false,
			Message: "Invalid candidate, field email not found",
			Status: 400,
		};
	}

	let Candidate = {
		name: unvalidatedCandidateRequest.name.toString(),
		email: unvalidatedCandidateRequest.email.toString(),
	};

	if (unvalidatedCandidateRequest.bio !== undefined) {
		Candidate.bio = unvalidatedCandidateRequest.bio.toString();
	}

	if (
		unvalidatedCandidateRequest.social_media !== undefined &&
		unvalidatedCandidateRequest.social_media.length > 0
	) {
		Candidate.social_media = unvalidatedCandidateRequest.social_media.map(
			(sm) => {
				return {
					name: sm.name.toString(),
					link: sm.link.toString(),
				};
			}
		);
	}

	if (
		unvalidatedCandidateRequest.skills !== undefined &&
		unvalidatedCandidateRequest.skills.length > 0
	) {
		Candidate.skills = unvalidatedCandidateRequest.skills.map((skill) => {
			return {
				name: skill.name.toString(),
				experience: skill.experience.toString(),
			};
		});
	}

	return {
		Valid: true,
		Candidate,
	};
};

const formatCandidate = function (databaseCandidate) {};

module.exports = {
	listCandidates,
	insertCandidate,
	updateCandidate,
};
