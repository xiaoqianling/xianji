import type { Journal } from './model'

export type SyncConfig = { url: string; token: string }

function endpoint(input: string) {
  const url = new URL(input.trim())
  const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) ||
      url.username || url.password || url.search || url.hash) throw new Error('请输入 HTTPS 服务地址。本机开发可使用 HTTP。')
  return url.toString().replace(/\/$/, '') + '/api/v1'
}

async function request<T>(url: string, token = '', body?: object): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' })
  if (token) headers.set('Authorization', 'Bearer ' + token)
  if (body) headers.set('Content-Type', 'application/json')
  let response: Response
  try {
    response = await fetch(url, { headers, body: body ? JSON.stringify(body) : undefined, method: body ? 'POST' : 'GET', signal: AbortSignal.timeout(12_000) })
  } catch { throw new Error('无法连接同步服务，请检查地址和网络。') }
  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.error?.message ?? '同步服务暂时不可用，请稍后重试。')
  }
  return response.json() as Promise<T>
}

export async function syncJournal(config: SyncConfig, journal: Journal, setConfig: (config: SyncConfig) => void) {
  const base = endpoint(config.url)
  const token = config.token || (await request<{ token: string }>(base + '/profiles', '', {})).token
  // 先保存新令牌，避免创建账户成功而首次上传失败时遗失访问方式。
  setConfig({ ...config, token })
  await request(base + '/journal', token, { completed: journal.completed, practice: journal.practice.slice(0, 200) })
  for (let i = 200; i < journal.practice.length; i += 200) {
    await request(base + '/journal', token, { completed: [], practice: journal.practice.slice(i, i + 200) })
  }
  let cursor = '0'
  const remote: Journal = { completed: [], practice: [] }
  do {
    const page = await request<Journal & { next: string }>(base + '/journal?after=' + cursor, token)
    remote.completed.push(...page.completed)
    remote.practice.push(...page.practice)
    cursor = page.next
  } while (cursor)
  return remote
}
