import fs from 'fs/promises'
import path from 'path'
import got from 'got'
import cheerio from 'cheerio'

const OUTPUT_DIR = path.join(process.cwd(), './scraper-output')
const OUTPUT_PATH = path.join(OUTPUT_DIR, './raw.json')
const GOT_OPTS = {
	prefixUrl: 'https://www.ulisses-regelwiki.de/'
}

const pages = {}

const $ = cheerio.load(await got('start.html', GOT_OPTS).text())
// fetch top level pages in parallel
await Promise.all($('nav.mod_t4c_megamenu ul a').map((i, linkEl) => parsePage(linkEl.attribs.href)).toArray())

async function parsePage(url) {
	if (pages[url]) {
		console.log('SKIPPING DUPLICATE', url)
		return
	}
	console.log('FETCHING', url)
	let html
	try {
		html = await got(url, GOT_OPTS).text()
	} catch (error) {
		console.log('FAILED FETCHING', url, error)
		return
	}
	const $ = cheerio.load(html)
	const page = {
		url,
		breadcrumbs: $('.mod_breadcrumb ul li:not(.sep)').map((i, el) => $(el).text()).toArray(),
		content: $('.mod_article').html()
	}
	pages[url] = page
	for (const link of $('.mod_navigation a.ulSubMenu, .mod_article a')) {
		const href = link.attribs.href
		if (href.startsWith('http')) continue
		await parsePage(href)
	}
}

await fs.mkdir(OUTPUT_DIR, {recursive: true})
await fs.writeFile(OUTPUT_PATH, JSON.stringify(pages, null, 2))
