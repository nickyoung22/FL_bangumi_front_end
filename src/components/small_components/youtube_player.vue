<template>
  <div class="youtube-player">
    <template v-if="!video_show">
      <img class="cover" :src="`https://i.ytimg.com/vi_webp/${id}/sddefault.webp`" />

      <svg
        @click="video_show = true"
        class="play-button"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M426.666667 682.666667V384l256 149.845333L426.666667 682.666667z m587.093333-355.541334s-10.026667-71.04-40.704-102.357333c-38.954667-41.088-82.602667-41.258667-102.613333-43.648C727.168 170.666667 512.213333 170.666667 512.213333 170.666667h-0.426666s-214.954667 0-358.229334 10.453333c-20.053333 2.389333-63.658667 2.56-102.656 43.648-30.677333 31.317333-40.661333 102.4-40.661333 102.4S0 410.538667 0 493.952v78.293333c0 83.456 10.24 166.912 10.24 166.912s9.984 71.04 40.661333 102.357334c38.997333 41.088 90.154667 39.765333 112.938667 44.074666C245.76 893.568 512 896 512 896s215.168-0.341333 358.442667-10.752c20.053333-2.432 63.658667-2.602667 102.613333-43.690667 30.72-31.317333 40.704-102.4 40.704-102.4s10.24-83.413333 10.24-166.869333v-78.250667c0-83.456-10.24-166.912-10.24-166.912z"
          fill="#FF0000"></path>
      </svg>
    </template>
    <template v-else>
      <iframe
        class="youtube-embed-video-iframe"
        :src="`https://www.youtube.com/embed/${id}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    </template>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const props = defineProps(['id'])

  const video_show = ref(false)
</script>

<style scoped lang="less">
  .youtube-player {
    width: 100%;
    height: 100%;

    position: relative;
    .cover {
      height: 100%;
    }

    .play-button {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 30%;
      cursor: pointer;
      transition: all 0.25s;
      &:hover {
        transform: scale(1.3);
      }
    }

    .youtube-embed-video-iframe {
      height: 100%;
      width: 300px;
    }
  }
</style>
