/**
 * Nexus 物理动力学与动效预设 (Motion Physics & Spring Dynamics)
 * 遵循 Anime-UI-Craft 与苹果 SwiftUI 紧实阻尼弹簧标准
 */

export const MOTION_CONFIG = {
  // 实体按压触感微缩 (传递沉稳物理分量)
  TAP_SCALE: 0.968,
  
  // 悬浮微胶囊滑块与按钮 (紧实高刚度、低超调、极速贴手)
  SPRING_SNAPPY: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },

  // 展开抽屉与卡片浮动 (滑行阻尼沉稳扎实)
  SPRING_DRAWER: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 26,
    mass: 1,
  },

  // 页面启幕入场演出 (600ms 内收敛入安定阅读态)
  ENTRANCE_TRANSITION: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1],
  },
} as const

export type MotionConfig = typeof MOTION_CONFIG
