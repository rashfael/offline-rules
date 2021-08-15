<template lang="pug">
.c-page
	.content(v-html="page.content")
</template>
<script setup>
import { ref, computed } from 'vue'
import data from '../../scraper-output/parsed.json'
const props = defineProps({
	categoryId: String,
	fragments: Array
})

let page = data.children[props.categoryId]
for (const fragment of props.fragments) {
	page = page.children[fragment]
}
</script>
<style lang="stylus">
.c-page
	display: flex
	padding: 16px
</style>
