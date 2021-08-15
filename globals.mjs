import path from 'path'

export const OUTPUT_DIR = path.join(process.cwd(), './scraper-output')
export const RAW_OUTPUT_PATH = path.join(OUTPUT_DIR, './raw.json')
export const PARSED_OUTPUT_PATH = path.join(OUTPUT_DIR, './parsed.json')
