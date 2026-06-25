import { Component, createEffect, createSignal, onCleanup } from 'solid-js'

export type AppLanguage = 'zh-CN' | 'en'

export const LANGUAGE_STORAGE_KEY = 'agnai.language'

const ZH_CN: Record<string, string> = {
  Settings: '设置',
  Close: '关闭',
  Cancel: '取消',
  Confirm: '确认',
  Information: '信息',
  AI: 'AI',
  UI: '界面',
  Voice: '语音',
  'Guest Data': '访客数据',
  Subscription: '订阅',
  Language: '语言',
  'Update Settings': '更新设置',
  'Delete Guest State': '删除访客状态',
  'This cannot be undone!': '此操作不可撤销！',
  Login: '登录',
  Register: '注册',
  Welcome: '欢迎',
  Authorizing: '正在授权',
  'You are already logged in.': '你已经登录。',
  'to your account or': '到你的账户，或',
  'or continue as a guest.': '或以访客身份继续。',
  'Failed to log in.': '登录失败。',
  "We couldn't reach our servers.": '无法连接到服务器。',
  'Something went wrong.': '出现了一些问题。',
  'Passwords do not match': '两次输入的密码不一致',
  'Display Name': '显示名称',
  'Display name': '显示名称',
  Username: '用户名',
  Password: '密码',
  'Confirm Password': '确认密码',
  'Registering...': '正在注册...',
  'Logging in...': '正在登录...',
  'Invalid callback URL': '无效的回调 URL',
  'Why register?': '为什么注册？',
  'Terms': '条款',
  'Privacy Policy': '隐私政策',
  'Term of Service': '服务条款',
  'Terms of Service': '服务条款',
  'Main': '主导航',
  'Agnaistic main page': 'Agnaistic 主页',
  'Version': '版本',
  'Character hub': '角色中心',
  CharHub: '角色中心',
  CHUB: '角色中心',
  Characters: '角色',
  Chats: '聊天',
  Presets: '预设',
  Library: '资料库',
  Sounds: '音效',
  Persona: '人设',
  'Sagas Preview': 'Sagas 预览',
  'Manage': '管理后台',
  'Server Configuration': '服务器配置',
  'User Management': '用户管理',
  'Subscriptions': '订阅与模型',
  'Announcements': '公告管理',
  'Login to the application': '登录应用',
  'Add a new preset': '新增预设',
  'Add a new character': '新增角色',
  'Create a new chat': '创建新聊天',
  'Show notification list': '显示通知列表',
  'Status: No new notifications': '状态：没有新通知',
  'Email Support': '邮件支持',
  'Open FAQ page': '打开常见问题页',
  'Open settings page': '打开设置页',
  'Image Generation': '图像生成',
  'Toggle between light and dark mode': '切换明暗模式',
  'Edit user profile': '编辑用户资料',
  'Open impersonation menu': '打开扮演菜单',
  'Subscribe for higher quality chats and no ads': '订阅以获得更高质量的聊天并移除广告',
  'Login issues? Try': '登录有问题？请尝试',
  'Logging out': '退出登录',
  'then log back in.': '然后重新登录。',
  'Page loading issues? Try': '页面加载有问题？请尝试',
  'clicking here': '点击这里',
  'Agnaistic failed to load': 'Agnaistic 加载失败',
  'Try Again': '重试',
  'Account Banned': '账户已被封禁',
  'This account has been banned for the following reason:': '此账户因以下原因被封禁：',
  'If you believe this is an error, please contact support.': '如果你认为这是误封，请联系支持。',
  'Recent Conversations': '最近对话',
  'Start Conversation': '开始对话',
  'Start conversation': '开始对话',
  'Create a Character': '创建角色',
  'Create a character': '创建角色',
  'Configure your AI Services': '配置你的 AI 服务',
  'Getting Started': '快速开始',
  Guides: '指南',
  Links: '链接',
  'Official Guides': '官方指南',
  'Memory Book': '记忆书',
  'Notable Features': '主要功能',
  Import: '导入',
  Create: '创建',
  Edit: '编辑',
  Select: '选择',
  Delete: '删除',
  Archive: '归档',
  Unarchive: '取消归档',
  Download: '下载',
  Done: '完成',
  'Last Modified': '最后修改',
  'Last Conversed': '最后对话',
  Created: '创建时间',
  Name: '名称',
  'Search by name...': '按名称搜索...',
  'List View': '列表视图',
  'Cards View': '卡片视图',
  'Folder View': '文件夹视图',
  'Selected: None': '已选择：无',
  Selected: '已选择',
  Favorites: '收藏',
  'Failed to load characters. Refresh to try again.': '角色加载失败，请刷新后重试。',
  'No characters found': '没有找到角色',
  'Create a character': '创建角色',
  'to get started!': '开始使用！',
  Editing: '正在编辑',
  'Archive characters?': '要归档角色吗？',
  'Unarchive characters?': '要取消归档角色吗？',
  'Are you sure you wish to delete characters?': '确定要删除这些角色吗？',
  'Chat Activity': '聊天活跃度',
  'Bot Activity': '角色活跃度',
  'Chat Created': '聊天创建时间',
  'Bot Name': '角色名称',
  'Bot Created': '角色创建时间',
  'Chat Counts': '聊天数量',
  New: '新建',
  'Search...': '搜索...',
  'All Characters': '全部角色',
  'No conversations': '没有对话',
  'Are you sure you wish to delete the conversation?': '确定要删除这段对话吗？',
  'You have no conversations yet.': '你还没有任何对话。',
  'You have no conversations with': '你还没有与以下角色对话：',
  Unknown: '未知',
  Models: '模型',
  'Horde Guide': 'Horde 指南',
  'Horde guide': 'Horde 指南',
  'OpenAI Guide': 'OpenAI 指南',
  'OpenAI guide': 'OpenAI 指南',
  Important: '重要',
  'Horde Settings': 'Horde 设置',
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
