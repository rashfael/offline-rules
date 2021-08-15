<template lang="pug">
.app-bar
	bunt-input(name="search", v-model="search", icon="search")
	bunt-icon-button.btn-clear(@click="search = ''") close
.main
	nav.top-level
		router-link(v-for="category of topLevelCategories", :to="{path: `/${category}`}", :class="{'search-empty': !sortedFilteredCategories.includes(category)}") {{ category }}
	router-view(:key="$route.params.categoryId")
</template>
<script setup>
import { ref, computed, provide, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import rawData from '../scraper-output/parsed.json'
const topLevelCategories = ["Regeln", "Spezies", "Kulturen", "Professionen", "Sonderfertigkeiten", "Vor- und Nachteile", "Magie", "Götterwirken", "Rüstkammer", "Bestiarium", "Herbarium", "Gifte und Krankheiten"]

const search = ref('')

const filteredData = computed(() => {
	if (!search.value) return rawData
	const filterLevel = (level) => {
		if (level.id?.toLowerCase().includes(search.value.toLowerCase())) return level
		const filteredChildren = Object.entries(level.children).map(([key, value]) => [key, filterLevel(value)]).filter(([key, value]) => value)
		if (filteredChildren.length === 0) return
		return Object.assign({}, level, {children: Object.fromEntries(filteredChildren)})
	}
	return filterLevel(rawData) ?? {children: {}}
})

const sortedFilteredCategories = computed(() => {
	const filteredCategories = Object.values(filteredData.value.children).map(cat => cat.id)
	return topLevelCategories.filter(id => filteredCategories.includes(id))
})

watch(() => sortedFilteredCategories.value, () => {
	router.replace(`/${sortedFilteredCategories.value[0]}`)
})

provide('filteredData', filteredData)
</script>
<style lang="stylus">
.app-bar
	flex: none
	border-bottom: border-separator()
	height: 48px
	padding: 0 8px
	display: flex
	align-items: center
	.bunt-input
		input-style(size: compact)
		padding-top: 0
		width: 508px
		max-width: calc(100vw - 16px * 2)
	.btn-clear
		icon-button-style()
		margin-top: 2px
		margin-left: -36px
.main
	flex: auto
	display: flex
	min-height: 0
nav.top-level
	display: flex
	flex-direction: column
	border-right: border-separator()
	flex: none
	width: 160px
	a
		color: $clr-primary-text-light
		text-align: left
		height: 32px
		line-height: @height
		padding: 0 8px
		&:hover
			background-color: $clr-grey-200
		&.router-link-active
			background-color: $clr-grey-100
		&.search-empty
			color: $clr-disabled-text-light
</style>
