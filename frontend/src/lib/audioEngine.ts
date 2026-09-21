/**
 * Nexus Web Audio API 极简环境声学引擎 (Ambient Soundscape Engine)
 * 纯原生合成静谧二次元物语五声音阶与晨曦泛音，零外部大型音频依赖
 */

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isRunning: boolean = false
  private timerId: number | null = null
  private currentVolume: number = 0.35
  private listeners: Set<(playing: boolean, volume: number) => void> = new Set()

  // 纯净的日系晨曦五声音阶 (宫商角徵羽 / Pentatonic frequencies: D4, E4, G4, A4, B4, D5, E5)
  private notes: number[] = [293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25]

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioContextClass()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // 触发一次清脆温润的晨曦风铃钟音 (Soft Chime Note)
  private triggerChime() {
    if (!this.ctx || !this.masterGain || !this.isRunning) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const noteGain = this.ctx.createGain()
    const panNode = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null

    // 随机挑选五声音阶
    const freq = this.notes[Math.floor(Math.random() * this.notes.length)]
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    // 温润自然 attack (0.04s) 与长余韵 decay (2.8s)
    noteGain.gain.setValueAtTime(0, now)
    noteGain.gain.linearRampToValueAtTime(0.08, now + 0.04)
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8)

    // 轻柔双耳立体声游移 (-0.6 ~ +0.6)
    if (panNode) {
      const pan = (Math.random() - 0.5) * 1.2
      panNode.pan.setValueAtTime(pan, now)
      osc.connect(noteGain)
      noteGain.connect(panNode)
      panNode.connect(this.masterGain)
    } else {
      osc.connect(noteGain)
      noteGain.connect(this.masterGain)
    }

    osc.start(now)
    osc.stop(now + 3.0)

    // 随机定格下一声泛音的间距 (1.8s ~ 3.5s)
    if (this.isRunning) {
      const nextDelay = 1800 + Math.random() * 1800
      this.timerId = window.setTimeout(() => this.triggerChime(), nextDelay)
    }
  }

  public start() {
    if (this.isRunning) return
    this.initContext()
    this.isRunning = true
    this.triggerChime()
    this.notify()
  }

  public stop() {
    if (!this.isRunning) return
    this.isRunning = false
    if (this.timerId) {
      clearTimeout(this.timerId)
      this.timerId = null
    }
    this.notify()
  }

  public toggle() {
    if (this.isRunning) {
      this.stop()
    } else {
      this.start()
    }
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val))
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime)
    }
    this.notify()
  }

  public getStatus() {
    return {
      isPlaying: this.isRunning,
      volume: this.currentVolume,
    }
  }

  public subscribe(fn: (playing: boolean, volume: number) => void) {
    this.listeners.add(fn)
    fn(this.isRunning, this.currentVolume)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isRunning, this.currentVolume))
  }
}

export const audioEngine = new AudioEngine()
