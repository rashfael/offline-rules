import fs from 'fs/promises'
import got from 'got'
import cheerio from 'cheerio'
import { OUTPUT_DIR, RAW_OUTPUT_PATH, PARSED_OUTPUT_PATH } from '../globals.mjs'

const rawOutput = JSON.parse(await fs.readFile(RAW_OUTPUT_PATH, {encoding: 'utf8'}))

const parsed = {
	children: {}
}

for (const page of Object.values(rawOutput)) {
	if (page.url.includes('?')) {
		// skip rituale and zauber for now
		console.log('SKIPPING', page.url)
		continue
	}
	if (page.breadcrumbs[0] === 'DSA Regel Wiki') page.breadcrumbs.shift()
	console.log('PARSING', page.url, page.breadcrumbs)
	let parent = parsed
	while (page.breadcrumbs.length > 1) {
		const crumb = page.breadcrumbs.shift()
		if (!parent.children[crumb]) {
			// insert skeleton and fill later
			parent.children[crumb] = {
				id: crumb,
				children: {}
			}
		}
		parent = parent.children[crumb]
	}
	const id = page.breadcrumbs.shift()
	const parsedPage = {
		id,
		url: page.url,
		content: page.content,
		children: parent.children[id]?.children ?? {}
	}
	parent.children[id] = parsedPage
}

await fs.writeFile(PARSED_OUTPUT_PATH, JSON.stringify(parsed, null, 2))
