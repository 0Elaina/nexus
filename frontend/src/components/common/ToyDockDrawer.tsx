import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Disc3, Volume2, VolumeX, Play, Pause, ChevronDown, Clock, Compass, Radio } from 'lucide-react'
import { audioEngine } from '@/lib/audioEngine'
import { MOTION_CONFIG } from '@/config/motion'

export const ToyDockDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const [currentTime, setCurrentTime] = useState<string>('')

  // 监听声学引擎状态
  useEffect(() => {
    const unsub = audioEngine.subscribe((playing, vol) => {
      setIsPlaying(playing)
      setVolume(vol)
    })
    return unsub
  }, [])

  // 实时时钟更新
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleTogglePlay = () => {
    audioEngine.toggle()
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    audioEngine.setVolume(val)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* 折叠态：极度纯净的高斯微距触柄 (Quiet Ambient Anchor) */
          <motion.button
            key="collapsed-pill"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full soft-glass-panel border border-white/90 shadow-diffuse-md hover:shadow-diffuse-lg transition-all"
            title="展开外设抽屉：黑胶唱机与时空羁绊"
          >
            <div className="relative flex items-center justify-center">
              <Disc3
                className={`w-4 h-4 text-stone-700 ${
                  isPlaying ? 'animate-spin text-amber-600' : ''
                }`}
                style={{ animationDuration: '4s' }}
              />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <span className="text-xs font-mono text-stone-700 tracking-wider">
              {isPlaying ? 'SOUND ON' : 'DOCK'}
            </span>
          </motion.button>
        ) : (
          /* 展开态：微缩黑胶唱机与时空温度抽屉 (Toy-Dock Drawer) */
          <motion.div
            key="expanded-drawer"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={MOTION_CONFIG.SPRING_DRAWER}
            className="w-80 p-5 rounded-3xl soft-glass-panel border border-white/95 shadow-diffuse-lg space-y-5"
          >
            {/* 顶栏：标题与收起触点 */}
            <div className="flex items-center justify-between border-b border-stone-200/50 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-600" />
                <span className="font-zen text-sm font-bold text-stone-800">
                  留声机与时序外设
                </span>
              </div>
              <motion.button
                type="button"
                onClick={() => setIsOpen(false)}
                whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
                className="p-1 rounded-full hover:bg-stone-200/60 text-stone-500 transition-colors"
                title="收起抽屉"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </div>

            {/* 01. 微缩黑胶唱机 (Micro Vinyl Turntable) */}
            <div className="p-4 rounded-2xl soft-concave-card space-y-3.5">
              <div className="flex items-center gap-4">
                {/* 旋转黑胶唱片实体 */}
                <div className="relative w-16 h-16 rounded-full bg-stone-950 flex items-center justify-center border-2 border-stone-800 shadow-inner flex-shrink-0">
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '3s' }}
                  >
                    {/* 唱片沟槽同心圆 */}
                    <div className="w-12 h-12 rounded-full border border-stone-800/80 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-stone-700/60 flex items-center justify-center">
                        {/* 唱片中心标签印章 */}
                        <div className="w-5 h-5 rounded-full bg-amber-500/90 flex items-center justify-center text-[8px] font-bold text-stone-950">
                          N
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 磁头探针臂 (Tonearm) */}
                  <div
                    className={`absolute -top-1 -right-1 w-7 h-1 bg-stone-400 origin-top-right transition-transform duration-500 ${
                      isPlaying ? 'rotate-25' : '-rotate-12'
                    }`}
                    style={{
                      transformOrigin: '100% 0%',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  />
                </div>

                {/* 曲目与播放控制 */}
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-zen font-bold text-stone-800 leading-none">
                    晨曦静音 · 五声微风
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    Web Audio 原生合成
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <motion.button
                      type="button"
                      onClick={handleTogglePlay}
                      whileTap={{ scale: MOTION_CONFIG.TAP_SCALE }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-medium shadow-xs transition-colors"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>暂停</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>伴读泛音</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* 音量滑块 */}
              <div className="flex items-center gap-2 pt-1">
                {volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                )}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>
            </div>

            {/* 02. 时空羁绊与时序温度 (Temporal Anchors) */}
            <div className="space-y-2 text-[11px] font-mono text-stone-500">
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-stone-600 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  现时节律
                </span>
                <span className="text-stone-800 font-mono font-bold tracking-wider">
                  {currentTime || '12:00:00'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/60 border border-stone-100 space-y-1">
                <div className="flex items-center justify-between text-stone-600">
                  <span>🛰️ 旅行者一号航程</span>
                  <span className="font-semibold text-stone-800">48 年深空</span>
                </div>
                <div className="text-[10px] text-stone-400 font-sans">
                  仍在向太阳系外远航，持续接收微弱电波。
                </div>
              </div>

              <div className="px-1 text-[10px] text-stone-400 text-center font-sans">
                Nexus 博客工坊 · 持续记录中
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
