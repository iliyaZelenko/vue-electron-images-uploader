<template>
  <div>
    <v-alert
      type="info"
      :value="!images.length"
    >
      Here you will see the downloaded pictures.
    </v-alert>

    <v-container
      v-show="images.length"
      grid-list-sm
      fluid
    >
      <v-layout
        row
        wrap
        justify-center
      >
        <v-flex
          v-for="(img, index) in images"
          :key="index"
          xs4
          sm3
        >
          <image-card
            :img="img"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ImageCard from '@/components/ImageCard'

export default {
  name: 'Home',
  components: {
    ImageCard
  },
  data: () => ({}),
  computed: {
    images () {
      return JSON.parse(localStorage.getItem('uploaded')) || []
    }
  },
  async mounted () {
  }
}
</script>
