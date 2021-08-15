<template lang="pug">
.c-category
	nav(v-scrollbar.y="")
		NavLevel(v-for="level of sortedChildren", :level="level", :path="[]", :key="level.id")
	router-view(:key="$route.path", :categoryId="categoryId")
</template>
<script setup>
import { computed, inject } from 'vue'
import NavLevel from '~/components/NavLevel.vue'

const filteredData = inject('filteredData')
const props = defineProps({
	categoryId: String
})
const sortedChildren = computed(() => {
	const category = filteredData.value.children[props.categoryId]
	return Object.values(category?.children ?? {}).sort((a, b) => a.id.localeCompare(b.id))
})
</script>
<style lang="stylus">
.c-category
	display: flex
	> nav
		display: flex
		flex-direction: column
		flex: none
		width: 360px
		min-height: 0
		border-right: border-separator()
</style>
