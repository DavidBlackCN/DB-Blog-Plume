<template>
  <section class="about-card about-friends-card" aria-labelledby="about-friends-title">
    <header>
      <div>
        <p class="about-eyebrow">FRIEND LINKS</p>
        <h2 id="about-friends-title">一些同行的朋友</h2>
      </div>
      <RouterLink to="/more/friends/">查看全部好友</RouterLink>
    </header>

    <div class="about-friends-grid">
      <a
        v-for="friend in friends"
        :key="friend.link"
        :href="friend.link"
        target="_blank"
        rel="noopener noreferrer"
        class="about-friend"
      >
        <img
          :src="friend.avatar"
          :alt="`${friend.name} 的头像`"
          loading="lazy"
          @error="useFallbackAvatar"
        >
        <span>
          <strong>{{ friend.name }}</strong>
          <small>{{ friend.desc }}</small>
        </span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import friends from '../../data/friends.json'

function useFallbackAvatar(event: Event) {
  const image = event.currentTarget as HTMLImageElement
  image.src = '/avatar/davidblack-round.png'
}
</script>
