<template lang="pug">
.c-nav-level
	router-link(:to="{name: 'page', params: {fragments: path}}") {{ level.id }}
	NavLevel(v-for="child of children", :level="child", :path="path", :key="child.id")
</template>
<script setup>
import { ref, computed } from 'vue'
import data from '../../scraper-output/parsed.json'
const props = defineProps({
	level: Object,
	path: Array
})

const level = props.level
const path = [...props.path, level.id]
const children = computed(() => {
	return Object.values(props.level.children)
})
</script>
<style lang="stylus">
.c-nav-level
	flex: none
	display: flex
	flex-direction: column
	font-weight: 600
	white-space: nowrap
	&:hover
		background-color: $clr-grey-100
	a
		height: 32px
		line-height: @height
		padding: 0 4px
		color: $clr-primary-text-light
.c-nav-level > .c-nav-level
	margin-left: 12px
	padding-left: 4px
	font-weight: 500
	border-left: border-separator()
	&:hover
		background-color: $clr-grey-200
	> .c-nav-level
		font-weight: 400
		&:hover
			background-color: $clr-grey-300
		> .c-nav-level
			font-weight: 300
			&:hover
				background-color: $clr-grey-400
</style>
