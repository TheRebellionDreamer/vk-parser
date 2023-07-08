import { writeFile } from "fs";
import { target } from "./const/target.js";
import { extractPostsOfGroup } from "./modules/extract-posts-of-group.js";

const groupsPosts = await extractPostsOfGroup(target, 5);

const jsonView = JSON.stringify(groupsPosts, null, 3);

writeFile("../db.json", jsonView, (error) => {
	if (error) {
		throw new Error(error.message);
	}
	console.log("Файл с результатами парсинга успешно создан");
});
