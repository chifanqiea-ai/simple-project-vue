// 临时验证脚本：验证气泡提示的出现与自动消失（用完即删）
import { chromium } from '@playwright/test'

const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('页面报错: ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('控制台报错: ' + m.text().slice(0, 200))
})

// ① 修改成功 → 气泡"修改成功"出现
await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' })
await page.waitForSelector('h1:has-text("Spring Boot 入门指南")', { timeout: 15000 })
await page.getByRole('button', { name: '编辑' }).first().click()
await page.getByRole('button', { name: '保存' }).click()
await page.waitForSelector('text=修改成功', { timeout: 15000 })
console.log('① 修改成功气泡出现 ✓')

// ② 2 秒后自动消失（等它消失，超时 6 秒内消失即通过）
await page.waitForFunction(() => !document.body.innerText.includes('修改成功'), null, { timeout: 6000 })
console.log('② 气泡自动消失 ✓')

// ③ 校验失败 → 气泡"标题不能为空"
await page.getByRole('button', { name: '新增文章' }).click()
await page.getByRole('button', { name: '保存' }).click()
await page.waitForSelector('text=标题不能为空', { timeout: 15000 })
console.log('③ 校验失败气泡出现 ✓')
await page.getByRole('button', { name: '取消' }).click()

console.log(errors.length ? '=== 发现问题：\n' + errors.join('\n') : '=== 全程无页面报错 ===')
await browser.close()
