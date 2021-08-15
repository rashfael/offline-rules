import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	server: {
		host: 'localhost',
		port: 8880
	},
	plugins: [vue()],
	css: {
		preprocessorOptions: {
			stylus: {
				use: [require('buntpapier/stylus')({implicit: false})],
				imports: ['buntpapier/buntpapier/index.styl', path.join(__dirname, './src/styles/variables.styl')]
			}
		}
	},
	resolve: {
		alias: [
			{
				find: '~',
				replacement: path.resolve(__dirname, './src/')
			}
		]
	},
})
