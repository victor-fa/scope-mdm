import i18n from '@/lang'
/**
 * 动态插入css
 */
export const loadStyle = url => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

/**
 * 设置浏览器头部标题
 */
export const setTitle = function(title) {
  title = title ? `${title}` : i18n.t('login.title')
  const hasKey = i18n.te('route.' + title)
  if (hasKey) {
    window.document.title = i18n.t('route.' + title) + i18n.t('login.title')
  } else {
    window.document.title = title
  }
}
