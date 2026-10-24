<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  title: string
}>()
</script>

<template>
  <h1>{{ props.title }}</h1>
  <slot></slot>
  <slot name="action"></slot>
</template>
