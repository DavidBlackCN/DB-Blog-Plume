<!-- LoadingBars.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  /**
   * 整体尺寸。
   * 原版视觉基准约为 64 × 68px。
   */
  size?: number

  /**
   * 竖条颜色。
   * 默认使用站点当前主题色。
   */
  color?: string

  /**
   * 单次动画周期，单位 ms。
   */
  duration?: number

  /**
   * 上下移动的最大偏移量，单位 px。
   */
  amplitude?: number

  /**
   * 无障碍文本。
   */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 64,
  color: 'var(--vp-c-brand-1)',
  duration: 1180,
  amplitude: 6,
  label: '加载中',
})

/**
 * 以仓库原版 64px 宽度为设计基准缩放，
 * 这样 size 改变时，宽度、高度、间距和位移一起变化。
 */
const scale = computed(() => props.size / 64)

const style = computed(() => ({
  '--loader-size': `${props.size}px`,
  '--loader-frame-height': `${68 * scale.value}px`,
  '--loader-color': props.color,
  '--loader-duration': `${props.duration}ms`,
  '--loader-amplitude': `${props.amplitude * scale.value}px`,
  '--loader-amplitude-negative': `${props.amplitude * scale.value * -1}px`,
  '--loader-delay-2': `${props.duration * -0.144}ms`,
  '--loader-delay-3': `${props.duration * -0.288}ms`,
  '--loader-bar-width': `${8 * scale.value}px`,
  '--loader-gap': `${10 * scale.value}px`,
  '--loader-height-1': `${38 * scale.value}px`,
  '--loader-height-2': `${50 * scale.value}px`,
  '--loader-height-3': `${30 * scale.value}px`,
}))
</script>

<template>
  <span
    class="loading-bars"
    :style="style"
    role="status"
    :aria-label="label"
  >
    <span class="loading-bars__bar" aria-hidden="true" />
    <span class="loading-bars__bar" aria-hidden="true" />
    <span class="loading-bars__bar" aria-hidden="true" />
  </span>
</template>

<style scoped>
.loading-bars {
  display: inline-flex;
  width: var(--loader-size);
  height: var(--loader-frame-height);

  align-items: center;
  justify-content: center;
  gap: var(--loader-gap);

  vertical-align: middle;
}

.loading-bars__bar {
  display: block;

  width: var(--loader-bar-width);
  height: var(--loader-height-1);
  flex: 0 0 var(--loader-bar-width);

  border-radius: 999px;
  background: var(--loader-color);

  /*
   * transform 不影响文档流，
   * 因此动画不会引起 layout/reflow。
   */
  will-change: transform, opacity;

  animation:
    loading-bars-slide
    var(--loader-duration)
    ease-in-out
    infinite;
}

.loading-bars__bar:nth-child(2) {
  height: var(--loader-height-2);

  /*
   * 原版是固定 170ms。
   * 这里改成周期比例，因此 duration 改变后
   * 三根柱子的节奏仍保持一致。
   */
  animation-delay: var(--loader-delay-2);
}

.loading-bars__bar:nth-child(3) {
  height: var(--loader-height-3);
  animation-delay: var(--loader-delay-3);
}

@keyframes loading-bars-slide {
  0%,
  100% {
    transform: translate3d(0, var(--loader-amplitude), 0) scaleY(.84);
    opacity: 0.54;
  }

  50% {
    transform: translate3d(0, var(--loader-amplitude-negative), 0) scaleY(1.06);
    opacity: 1;
  }
}

/*
 * 尊重系统“减少动态效果”设置。
 * 仓库原实现也专门处理了 prefers-reduced-motion。
 */
@media (prefers-reduced-motion: reduce) {
  .loading-bars__bar {
    animation: none;
    transform: none;
    opacity: 1;
    will-change: auto;
  }
}
</style>
