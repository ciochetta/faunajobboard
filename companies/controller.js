const { client, q } = require("../db");

const listCompanies = async function () {
	let result = await client.query(
		q.Map(
			q.Paginate(q.Documents(q.Collection("companies"))),
			q.Lambda((x) => q.Get(x))
		)
	);

	const cleanResult = result.data.map(formatCompany);

	return cleanResult;
};

const insertCompany = async function (requestCompany) {
	const validation = validateCompany(requestCompany);

	if (!validation.Valid) {
		return {
			Message: validation.Message,
			Status: validation.Status,
			Data: {},
		};
	}

	let company = validation.Company;

	const result = await client.query(
		q.Create(q.Collection("companies"), { data: company })
	);

	const cleanResult = formatCompany(result);

	return {
		Message: "Company was created sucessfuly",
		Data: cleanResult,
		Status: 200,
	};
};

const getCompany = async function (reference) {
	let result = await client.query(
		q.Get(q.Ref(q.Collection("companies"), reference))
	);

	const cleanResult = formatCompany(result);

	return cleanResult;
};

const updateCompany = async function (requestCompany, reference) {
	if (reference == undefined || null) {
		return {
			Message: "No id provided",
			Status: 400,
			Data: {},
		};
	}

	dbCompany = await getCompany(reference);

	if (dbCompany == undefined) {
		return {
			Message: "Company not found",
			Status: "400",
			Data: {},
		};
	}

	let editedEntries = Object.entries(dbCompany).map(([key, value]) => {
		return [key, requestCompany[key] || value];
	});

	let new_entries = Object.entries(requestCompany).filter(([key, value]) => {
		return !editedEntries.some(([keyE, valueE]) => {
			return keyE === key;
		});
	});

	for (var i = 0; i < new_entries.length; i++) {
		editedEntries.push(new_entries[i]);
	}

	let editedCompany = Object.fromEntries(editedEntries);

	validation = validateCompany(editedCompany);

	if (!validation.Valid) {
		return {
			Message: validation.Message,
			Status: validation.Status,
			Data: {},
		};
	}

	company = validation.Company;

	let result = await client.query(
		q.Update(q.Ref(q.Collection("companies"), reference), {
			data: company,
		})
	);

	const cleanResult = formatCompany(result);

	return {
		Message: "Company was edited sucessfuly",
		Data: cleanResult,
		Status: 200,
	};
};

const validateCompany = function (unvalidatedCompany) {
	if (unvalidatedCompany == undefined || unvalidatedCompany == null) {
		return {
			Valid: false,
			Message: "Company is undefined or null",
			Status: 400,
		};
	}

	if (unvalidatedCompany.name == undefined) {
		return {
			Valid: false,
			Message: "Invalid company, field name not found",
			Status: 400,
		};
	}

	if (unvalidatedCompany.email == undefined) {
		return {
			Valid: false,
			Message: "Invalid company, field email not found",
			Status: 400,
		};
	}

	let Company = {
		name: unvalidatedCompany.name.toString(),
		email: unvalidatedCompany.email.toString(),
	};

	if (
		unvalidatedCompany.description != null ||
		unvalidatedCompany != undefined
	) {
		Company.description = unvalidatedCompany.description.toString();
	}

	if (
		unvalidatedCompany.social_media != null ||
		unvalidatedCompany.social_media.length > 0
	) {
		Company.social_media = unvalidatedCompany.social_media.map((sm) => {
			return {
				name: sm.name.toString(),
				link: sm.link.toString(),
			};
		});
	}

	return {
		Valid: true,
		Company,
	};
};

const formatCompany = function (databaseCompany) {
	return {
		name: databaseCompany.data.name,
		ref: databaseCompany.ref.id,
		email: databaseCompany.data.email,
		description: databaseCompany.data.description,
		social_media: databaseCompany.data.social_media,
	};
};

module.exports = {
	listCompanies,
	insertCompany,
	updateCompany,
};
