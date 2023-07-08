import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import { Target } from "../types/target.js";
import { Group } from "../types/group.js";
import { Post } from "../types/post.js";

/**
 * @param targetList Массив групп ВК
 * @param countOfPosts Кол-во постов на вывод
 */
export async function extractPostsOfGroup(
	targetList: Target[],
	countOfPosts: number,
): Promise<Group[]> {
	const groupsPosts: Group[] = [];

	/* Запускаем браузер и открываем новую страницу */
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();

	for await (const target of targetList) {
		await page.goto(target.url);

		const content = await page.content();

		const $ = cheerio.load(content);

		/* Находим посты, берем только n-число постов и текст внутри блока  */
		const textList = getArrayBySelector($, ".wall_post_text", countOfPosts);

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

		groupsPosts.push({ groupName: target.name, posts: result });
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
