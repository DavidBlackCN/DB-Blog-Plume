<template>
  <div class="text">
    <p class="hitokoto">{{ hitokoto }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hitokoto: "正在加载一言..."
    };
  },
  async mounted() {
    try {
      const response = await fetch("https://v1.hitokoto.cn");
      const data = await response.json();
      this.hitokoto = `${data.hitokoto} —— ${data.from}`;
    } catch (e) {
      this.hitokoto = "生活不止眼前的苟且。";
    }
  }
};
</script>

<style scoped>
.text {
  position: relative;
  bottom: -30px;
  text-align: center;
  padding: 2rem;
  color: #6a737d;
}
.hitokoto {
  font-style: italic;
  margin-bottom: 0.5rem;
}
</style>