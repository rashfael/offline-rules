<template lang="pug">
.c-page(v-scrollbar.y="")
	.content(v-html="page.content")
</template>
<script setup>
import { ref, computed } from 'vue'
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
	flex-direction: column
	flex: auto
	.content
		padding: 16px
</style>
