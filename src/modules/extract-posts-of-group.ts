import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { Target } from "../types/target.js";
import { Group } from "../types/group.js";
import { Post } from "../types/post.js";
import { timeFormatter } from "./time-formatter.js";

/**
 * @param targetList Массив групп ВК
 * @param countOfPosts Кол-во постов на вывод
 */
export async function extractPostsOfGroup(
	targetList: Target[],
	countOfPosts: number,
): Promise<Group[]> {
	console.log("Запуск процесса... ⚒️ \n");
	const groupsPosts: Group[] = [];

	/* Запускаем браузер и открываем новую страницу */
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();

	for await (const target of targetList) {
		try {
			await page.goto(target.url);

			const content = await page.content();

			const $ = cheerio.load(content);

			/* Находим посты, берем только n-число постов и текст внутри блока  */
			const textList = getArrayBySelector(
				$,
				".wall_post_text",
				countOfPosts,
			);

			/* Так же и с датами */
			const dateList = getArrayBySelector(
				$,
				".PostHeaderSubtitle__item",
				countOfPosts,
			);

			/* Объединяем и добавляем в массив результата */
			const result = textList.map(
				(value, index): Post => ({
					text: value,
					date: dateList[index],
				}),
			);

			console.log(
				`✅ Данные из ${
					target.name
				} успешно получены, время ${timeFormatter(new Date())}`,
			);
			groupsPosts.push({ groupName: target.name, posts: result });
		} catch {
			console.log(
				`❌ Не удалось получить данные по группе ${
					target.name
				}, время ${timeFormatter(new Date())} url: ${target.url}`,
			);
		}
	}

	/* Закрываем браузер */
	await browser.close();

	return groupsPosts;
}

function getArrayBySelector(
	$: cheerio.CheerioAPI,
	selector: ".wall_post_text" | ".PostHeaderSubtitle__item",
	count: number,
) {
	return $(selector)
		.map((_, el) => $(el).text())
		.toArray()
		.slice(0, count);
}
