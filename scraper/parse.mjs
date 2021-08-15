import fs from 'fs/promises'
import got from 'got'
import cheerio from 'cheerio'
import { OUTPUT_DIR, RAW_OUTPUT_PATH, PARSED_OUTPUT_PATH } from '../globals.mjs'

const rawOutput = JSON.parse(await fs.readFile(RAW_OUTPUT_PATH, {encoding: 'utf8'}))

const parsed = {
	children: {}
}

for (const page of Object.values(rawOutput)) {
	// urls with ? are magic spells
	const isSpell = page.url.includes('?')
	if (page.breadcrumbs[0] === 'DSA Regel Wiki') page.breadcrumbs.shift()
	console.log('PARSING', page.url)
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
	let id
	// magic spells don't have their name in the breadcrumbs
	if (!isSpell) {
		id = page.breadcrumbs.shift()
	}

	let content = page.content
	if (content) {
		const $ = cheerio.load(content)
		if ($('form').length > 0) {
			// if we don't have an id, something went horribly wrong
			if (!id) {
				console.log('SKIPPING', page.url)
				continue
			}
			// if we have a form, it probably is a magic filter thingy, which we can ignore
			id = id.split('auswahl')[0]
			content = $('.ce_text').eq(1).html()
		} else if (isSpell) {
			id = $('.header').text()
		}
	}

	const parsedPage = {
		id,
		url: page.url,
		content,
		children: parent.children[id]?.children ?? {}
	}
	parent.children[id] = parsedPage
}

await fs.writeFile(PARSED_OUTPUT_PATH, JSON.stringify(parsed))
