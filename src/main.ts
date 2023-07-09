import { writeFile } from "fs";

import { extractPostsOfGroup } from "./modules/extract-posts-of-group.js";
import target from "./target.json" assert { type: "json" };

const groupsPosts = await extractPostsOfGroup(target, 5);

const jsonView = JSON.stringify(groupsPosts, null, 3);

writeFile("../db.json", jsonView, (error) => {
	if (error) {
		throw new Error(error.message);
	}
	console.log("\nФайл с результатами успешно создан");
});
