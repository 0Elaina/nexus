import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * Nexus 博客管理端全局主题接管
 * 统一管理 Naive UI 组件库标准尺寸、内边距与微距质感，杜绝模板内魔法值
 */
export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1C1917',
    primaryColorHover: '#2B2623',
    primaryColorPressed: '#141210',
    primaryColorSuppl: '#2B2623',
    infoColor: '#2563EB',
    infoColorHover: '#3B82F6',
    successColor: '#059669',
    successColorHover: '#10B981',
    warningColor: '#D97706',
    warningColorHover: '#F59E0B',
    errorColor: '#F43F5E',
    errorColorHover: '#FB7185',
    bodyColor: '#F8F8F6',
    cardColor: 'rgba(255, 255, 255, 0.75)',
    modalColor: 'rgba(255, 255, 255, 0.98)',
    popoverColor: 'rgba(255, 255, 255, 0.98)',
    textColorBase: '#1C1917',
    textColor1: '#1C1917',
    textColor2: '#57534E',
    textColor3: '#78716C',
    textColorDisabled: '#A8A29E',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '10px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", sans-serif',
    fontFamilyMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  },
  DataTable: {
    borderRadius: '16px',
    thPaddingMedium: '16px 24px',
    tdPaddingMedium: '18px 24px',
    thFontWeight: '600',
    thTextColor: '#78716C',
    thColor: 'rgba(255, 255, 255, 0.45)',
    tdColor: 'transparent',
    tdColorHover: 'rgba(255, 255, 255, 0.55)',
    borderColor: 'rgba(0, 0, 0, 0.04)',
    fontSizeMedium: '13px'
  },
  Pagination: {
    itemPadding: '0 8px',
    itemSizeMedium: '32px',
    itemBorderRadius: '8px',
    buttonIconSizeMedium: '14px',
    itemTextColorHover: '#1C1917',
    itemTextColorActive: '#1C1917'
  },
  Button: {
    borderRadiusMedium: '10px',
    borderRadiusSmall: '8px',
    paddingMedium: '8px 16px',
    paddingSmall: '6px 12px',
    fontWeight: '500'
  },
  Tag: {
    borderRadius: '6px',
    padding: '4px 10px',
    fontSizeSmall: '12px',
    fontSizeMedium: '12px'
  },
  Modal: {
    borderRadius: '18px',
    color: 'rgba(255, 255, 255, 0.98)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 24px 60px rgba(28, 25, 23, 0.12)'
  },
  Card: {
    borderRadius: '16px',
    color: 'rgba(255, 255, 255, 0.75)',
    borderColor: 'rgba(255, 255, 255, 0.65)'
  },
  Input: {
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.95)',
    paddingMedium: '8px 12px'
  },
  Form: {
    feedbackHeightMedium: '22px',
    labelFontSizeTopMedium: '13px',
    labelFontWeight: '500',
    labelTextColor: '#57534E'
  },
  Popconfirm: {
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
  }
}