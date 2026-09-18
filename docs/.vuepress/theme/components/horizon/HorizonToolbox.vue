<template>
  <section class="horizon-panel horizon-toolbox" aria-labelledby="horizon-toolbox-title">
    <header class="horizon-section-heading">
      <div>
        <p class="horizon-eyebrow">TOOLBOX</p>
        <h2 id="horizon-toolbox-title">会的一点点</h2>
      </div>
      <span>14 ITEMS</span>
    </header>

    <div class="horizon-toolbox__tracks" tabindex="0" aria-label="技术栈，悬停或聚焦时暂停滚动">
      <div v-for="(row, rowIndex) in techRows" :key="rowIndex" class="horizon-toolbox__viewport">
        <div :class="['horizon-toolbox__track', `is-row-${rowIndex + 1}`]">
          <div v-for="copy in 2" :key="copy" class="horizon-toolbox__set" :aria-hidden="copy === 2">
            <span v-for="item in row" :key="`${copy}-${item.name}`" class="horizon-tech-item">
              <Icon
                :name="item.icon"
                :style="{ '--horizon-icon-scale': item.iconScale ?? 1 }"
                aria-hidden="true"
              />
              <b>{{ item.name }}</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { techRows } from '../../data/about-page'
</script>
