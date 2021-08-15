import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import Category from './components/Category.vue'
import Page from './components/Page.vue'

const routes = [{
	path: '/',
	component: App,
	children: [{
		path: ':categoryId',
		component: Category,
		props: true,
		children: [{
			path: ':fragments+',
			name: 'page',
			component: Page,
			props: true
		}]
	}]
}]

export default createRouter({
	history: createWebHistory(),
	routes
})
