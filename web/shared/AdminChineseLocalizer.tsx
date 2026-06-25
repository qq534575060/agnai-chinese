import { Component, createEffect, createSignal, onCleanup } from 'solid-js'

export type AppLanguage = 'zh-CN' | 'en'

export const LANGUAGE_STORAGE_KEY = 'agnai.language'

const ZH_CN: Record<string, string> = {
  Settings: '设置',
  Close: '关闭',
  AI: 'AI',
  UI: '界面',
  Voice: '语音',
  'Guest Data': '访客数据',
  Subscription: '订阅',
  Language: '语言',
  'Update Settings': '更新设置',
  'Delete Guest State': '删除访客状态',
  'This cannot be undone!': '此操作不可撤销！',
}

const getStoredLanguage = (): AppLanguage => {
  if (typeof localStorage === 'undefined') return 'zh-CN'
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'zh-CN'
}

const [language, setLanguageSignal] = createSignal<AppLanguage>(getStoredLanguage())

export const appLanguage = language

export function getAppLanguage(): AppLanguage {
  return language()
}

export function setAppLanguage(next: AppLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
  setLanguageSignal(next)
  document.documentElement.lang = next
  window.dispatchEvent(new CustomEvent('agnai-language-change', { detail: next }))
}

export function t(key: string) {
  if (language() === 'en') return key
  return ZH_CN[key] || key
}

const AdminChineseLocalizer: Component = () => {
  createEffect(() => {
    document.documentElement.lang = language()
  })

  const onStorage = (event: StorageEvent) => {
    if (event.key !== LANGUAGE_STORAGE_KEY) return
    setLanguageSignal(getStoredLanguage())
  }

  window.addEventListener('storage', onStorage)
  onCleanup(() => window.removeEventListener('storage', onStorage))

  return null
}

export default AdminChineseLocalizer
