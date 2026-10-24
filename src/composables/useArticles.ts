import { computed } from 'vue'
import { useArticleStore } from '../stores/article'
import { storeToRefs } from 'pinia'

export function useArticles() {
  const store = useArticleStore()
  const { articles, filteredArticles, statusFilter } = storeToRefs(store)
  const { listByStatus, publish, draft } = store

  const countByStatus = computed(() => {
    return {
      all: articles.value.length,
      published: articles.value.filter((a) => a.status === 'published').length,
      draft: articles.value.filter((a) => a.status === 'draft').length,
      archived: articles.value.filter((a) => a.status === 'archived').length,
    }
  })

  return { listByStatus, publish, draft, countByStatus, statusFilter, filteredArticles, articles }
}
