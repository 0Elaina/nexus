import type { GlobalThemeOverrides } from 'naive-ui'

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18181b',
    primaryColorHover: '#27272a',
    primaryColorPressed: '#09090b',
    primaryColorSuppl: '#27272a',
    borderRadius: '6px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  Button: {
    borderRadiusMedium: '6px'
  },
  Card: {
    borderRadius: '8px'
  },
  DataTable: {
    borderRadius: '8px'
  },
  Tag: {
    borderRadius: '4px'
  }
}