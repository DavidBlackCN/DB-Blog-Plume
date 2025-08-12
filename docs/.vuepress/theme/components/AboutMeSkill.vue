<template>
  <div class="about-me-card-bg vp-blog-post-item about-me-skill">
    <div style="margin-left: 20px">
      <p class="about-me-card-title-normal">𝓐𝓫𝓲𝓵𝓲𝓽𝓲𝓮𝓼</p>
      <p class="about-me-card-text-big about-me-card-text-color">技术栈</p>
    </div>
    <!-- 第一行向左移动 -->
    <div class="marquee-row first-row">
      <div class="marquee-content">
        <span v-for="(item, index) in technology" :key="index"> <icon :name="item.icon"/> </span>
        <span v-for="(item, index) in technology" :key="index + technology.length"><icon :name="item.icon"/></span>
      </div>
    </div>
    <!-- 第二行向右移动 -->
    <div class="marquee-row second-row">
      <div class="marquee-content">
        <span v-for="(item, index) in tools" :key="index"><icon :name="item.icon"/></span>
        <span v-for="(item, index) in tools" :key="index + tools.length"><icon :name="item.icon"/></span>
      </div>
    </div>

    <div class="about-me-skill-detail">
      <span v-for="(item, index) in technology" :key="index"> <icon
          :name="item.icon"/> <span>{{ item.type }}</span>  </span>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

// 技能
const technology = ref([
  {type: '熟练掌握以下技术栈的安装及卸载操作.', icon: 'skill-icons:markdown-dark'},
  {type: 'Vue', icon: 'logos:vue'},
  {type: 'Vite', icon: 'logos:vitejs'},
  {type: 'JavaScript', icon: 'vscode-icons:file-type-js'},
  {type: 'TypeScript', icon: 'vscode-icons:file-type-typescriptdef'},
  {type: 'CSS3', icon: 'logos:css-3'},
  {type: 'HTML5', icon: 'logos:html-5'},
  {type: 'Spring', icon: 'devicon:spring'},
  {type: 'MySQL', icon: 'devicon:mysql'},
  {type: 'Rust', icon: 'logos:rust'},
  {type: 'Java', icon: 'logos:java'},
  {type: 'C++', icon: 'logos:c-plusplus'},
  {type: 'Python', icon: 'logos:python'},
  {type: 'Golang', icon: 'logos:go'},
]);

// 工具
const tools = ref([
  {type: 'WebStorm', icon: 'devicon:webstorm'},
  {type: 'VSCode', icon: 'vscode-icons:file-type-vscode'},
  {type: 'Android Studio', icon: 'devicon:androidstudio'},
  {type: 'pnpm', icon: 'vscode-icons:file-type-light-pnpm'},
  {type: 'npm', icon: 'logos:npm'},
  {type: 'Vite', icon: 'devicon:vitejs'},
  {type: 'IDEA', icon: 'logos:intellij-idea'},
  {type: 'Netlify', icon: 'devicon:netlify'},
]);
</script>

<style scoped>
.about-me-skill {
  position: relative;
  min-height: 316px;
  padding: 10px 0;
  z-index: 1;

  &:hover .marquee-row {
    opacity: 0;
  }

  &:hover .about-me-skill-detail {
    opacity: 1;
  }
}

.about-me-skill-detail {
  position: absolute;
  top: 120px;
  opacity: 0;
  z-index: 2;
  display: flex;
  padding: 0 20px;
  transition: opacity 0.5s;
  flex-wrap: wrap;

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 6px 6px 0;
    border-radius: 8px;
    padding: 7px;
    font-size: 16px;
    color: var(--vp-c-text-2);
    background-color: var(--home-action-bnt-bg);
  }
}

.marquee-row {
  transition: opacity 0.6s 0.1s;
  width: 105%;
  margin-left: -6px;
  overflow: hidden;
  white-space: nowrap;
  transform: rotateZ(-6deg);
}

.marquee-content {
  display: inline-flex;
  animation: marquee-left 30s linear infinite;

  > span {
    border-radius: 20%;
    align-content: center;
    align-items: center;
    background-color: var(--about-me-skill-item-bg);
    width: 80px;
    height: 80px;
    font-size: 50px;
    margin: 0 10px;
  }

}

.first-row {
  margin-top: 20px;
}

.second-row {
  margin-top: 20px;
}

.second-row .marquee-content {
  animation: marquee-right 50s linear infinite;
}

@keyframes marquee-left {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes marquee-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}
</style>