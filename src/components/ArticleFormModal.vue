<script setup lang="ts">
import { ref } from 'vue'
import type { Article, ArticleStatus, ArticlePayload } from '../types/Article'
import { useArticleStore } from '../stores/article'
import { statusMap } from '../types/Article'

// 传入 null = 新建模式；传入文章 = 编辑模式（预先填好当前值）
const props = defineProps<{ article: Article | null }>()
const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = useArticleStore()
const isEdit = props.article !== null

const title = ref(props.article?.title ?? '')
const status = ref<ArticleStatus>(props.article?.status ?? 'draft')
const tagsText = ref(props.article?.tags.join(', ') ?? '')
// 编辑模式下作者不可改（后端"带 id 就关联已有作者"），只显示
const authorName = ref(props.article?.author.name ?? '')
const authorAvatar = ref(props.article?.author.avatar ?? '')
const publishedAtText = ref(props.article?.publishedAt?.slice(0, 16) ?? '')
const views = ref(props.article ? String(props.article.stats.views) : '0')
const likes = ref(props.article ? String(props.article.stats.likes) : '0')

const saving = ref(false)

async function save() {
  // 简单校验：标题必填；新建时作者姓名必填
  if (!title.value.trim()) {
    alert('标题不能为空')
    return
  }
  if (!isEdit && !authorName.value.trim()) {
    alert('作者姓名不能为空')
    return
  }

  const payload: ArticlePayload = {
    ...(isEdit ? { id: props.article!.id } : {}),
    title: title.value.trim(),
    status: status.value,
    // 中文逗号也当分隔符
    tags: tagsText.value.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
    // 新建：填了姓名就自动新建作者；编辑：原样带 id 传回，关联已有作者
    author: isEdit
      ? props.article!.author
      : { name: authorName.value.trim(), ...(authorAvatar.value.trim() ? { avatar: authorAvatar.value.trim() } : {}) },
    stats: { views: Number(views.value) || 0, likes: Number(likes.value) || 0 },
    // datetime-local 只给到"分钟"，后端要"秒"，补上 :00；留空就是没发布时间
    publishedAt: publishedAtText.value ? publishedAtText.value + ':00' : null,
  }

  saving.value = true
  const ok = isEdit ? await store.editArticle(payload) : await store.addArticle(payload)
  saving.value = false
  if (ok) {
    emit('saved')
  }
}
</script>

<template>
  <!-- 弹窗：半透明遮罩 + 居中面板 -->
  <div
    style="
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    "
    @click.self="emit('close')"
  >
    <div style="background: #fff; border: 2px solid #888; padding: 16px; width: 420px">
      <h2 style="margin: 0 0 12px">{{ isEdit ? '编辑文章' : '新增文章' }}</h2>

      <label>标题：<input v-model="title" style="width: 100%" /></label>

      <p>
        状态：
        <select v-model="status">
          <option value="draft">{{ statusMap.draft }}</option>
          <option value="published">{{ statusMap.published }}</option>
          <option value="archived">{{ statusMap.archived }}</option>
        </select>
      </p>

      <label>标签（逗号分隔）：<input v-model="tagsText" style="width: 100%" placeholder="如：vue, 教程" /></label>

      <p v-if="isEdit">
        作者：{{ authorName }}（编辑时不可改，后端按 id 关联已有作者）
      </p>
      <template v-else>
        <label>作者姓名：<input v-model="authorName" style="width: 100%" /></label>
        <label>作者头像（可选）：<input v-model="authorAvatar" style="width: 100%" placeholder="图片网址" /></label>
      </template>

      <label>发布时间（留空则无）：<input v-model="publishedAtText" type="datetime-local" /></label>

      <p>
        查看量：<input v-model="views" type="number" min="0" style="width: 80px" />
        点赞量：<input v-model="likes" type="number" min="0" style="width: 80px" />
      </p>

      <div style="text-align: right; margin-top: 8px">
        <button @click="emit('close')">取消</button>
        <button :disabled="saving" @click="save">{{ saving ? '保存中…' : '保存' }}</button>
      </div>
    </div>
  </div>
</template>
