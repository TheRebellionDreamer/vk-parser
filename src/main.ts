import { writeFile } from "fs/promises";
import { target } from "./const/target.js";
import { extractPostsOfGroup } from "./modules/extract-posts-of-group.js";

const groupsPosts = await extractPostsOfGroup(target, 5);

const jsonView = JSON.stringify(groupsPosts, null, 3);

await writeFile("../db.json", jsonView);
