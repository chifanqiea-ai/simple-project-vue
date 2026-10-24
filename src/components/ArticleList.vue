<script setup lang="ts">
import ArticleCard from './ArticleCard.vue'
import {  type Article } from '../types/Article.ts'

// 纯展示组件：数据由父组件传进来（props），自己不再去 store 拿。
// 谁给数据谁负责算好，组件只负责"摆出来"
defineProps<{ articles: Article[] }>()
</script>

<template>
  <ArticleCard v-for="item in articles" :key="item.id" :article="item" />
</template>
