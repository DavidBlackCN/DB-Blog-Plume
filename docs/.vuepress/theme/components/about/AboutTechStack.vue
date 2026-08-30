<template>
  <article class="about-card about-tech-card" tabindex="0">
    <header class="about-tech-card__heading">
      <div>
        <p class="about-eyebrow">TOOLBOX</p>
        <h3>会的一点点</h3>
      </div>
      <span>{{ techCount }} ITEMS</span>
    </header>

    <div
      v-for="(row, rowIndex) in techRows"
      :key="rowIndex"
      :class="['about-tech-row', { 'is-reverse': rowIndex === 1 }]"
    >
      <div class="about-tech-track">
        <ul class="about-tech-list">
          <li v-for="item in row" :key="item.name">
            <span
              class="about-tech-icon"
              :style="{ '--about-tech-icon-scale': item.iconScale ?? 1 }"
              aria-hidden="true"
            >
              <Icon :name="item.icon" />
            </span>
            <span>{{ item.name }}</span>
          </li>
        </ul>
        <ul class="about-tech-list" aria-hidden="true">
          <li v-for="item in row" :key="`clone-${item.name}`">
            <span
              class="about-tech-icon"
              :style="{ '--about-tech-icon-scale': item.iconScale ?? 1 }"
            >
              <Icon :name="item.icon" />
            </span>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { techRows } from '../../data/about-page'

const techCount = computed(() => techRows.reduce((count, row) => count + row.length, 0))
</script>
