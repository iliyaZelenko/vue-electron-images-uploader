<template>
  <div>
    <v-hover>
      <v-card
        slot-scope="{ hover }"
        style="border-radius: 10px;"
        flat
        tile
      >
        <!--transition="slide-y-reverse-transition"-->
        <v-fade-transition>
          <v-speed-dial
            v-if="hover && !img.link"
            v-model="menu"
            class="mt-2"
            direction="left"
            absolute
            right
            open-on-hover
          >
            <v-btn
              slot="activator"
              v-model="menu"
              color="blue darken-2"
              dark
              fab
            >
              <v-icon>settings</v-icon>
            </v-btn>
            <v-btn
              color="red"
              class="white--text"
              fab
              small
              @click="$emit('removeFile', img)"
            >
              <v-icon>delete</v-icon>
            </v-btn>
            <v-btn
              color="indigo"
              class="white--text"
              fab
              small
              @click="$emit('editFile', img)"
            >
              <v-icon>edit</v-icon>
            </v-btn>
          </v-speed-dial>
        </v-fade-transition>
        <v-img
          :src="(img.link || img.preview)"
          :class="{'img-preview grey lighten-2': true, 'img-preview--with-link': img.link}"
          aspect-ratio="1"
          @click="() => { img.link && openInBrowser(img) }"
        >
          <v-layout
            slot="placeholder"
            fill-height
            align-center
            justify-center
            ma-0
          >
            <v-progress-circular
              color="grey lighten-5"
              indeterminate
            />
          </v-layout>
        </v-img>
        <div v-if="img.completed">
          {{ +img.completed === 100 ? 'Loading is complete' : img.completed + ' / 100%' }}
        </div>
        <v-progress-linear
          :active="img.completed > 0"
          :value="img.completed"
          class="my-0"
          color="success"
          height="7"
        />
        <v-card-title>
          <!--<v-fade-transition>-->
            <!--<div v-if="hover && !img.link">-->
              <!--<v-btn-->
                <!--color="red"-->
                <!--class="white&#45;&#45;text"-->
                <!--absolute-->
                <!--fab-->
                <!--small-->
                <!--right-->
                <!--top-->
                <!--@click="$emit('removeFile', img)"-->
              <!--&gt;-->
                <!--<v-icon>close</v-icon>-->
              <!--</v-btn>-->
              <!--<v-btn-->
                <!--color="primary"-->
                <!--absolute-->
                <!--fab-->
                <!--small-->
                <!--left-->
                <!--top-->
                <!--@click="$emit('editFile', img)"-->
              <!--&gt;-->
                <!--<v-icon>edit</v-icon>-->
              <!--</v-btn>-->
            <!--</div>-->
          <!--</v-fade-transition>-->
          <div
            class="text-truncate"
            style="width: 100%;"
          >
            <span
              :title="img.name"
              class="title"
              style="max-width: 100%;"
            >
              {{ img.name }}
            </span>
          </div>
          <div class="ml-2 mt-2 grey--text text--darken-2">
            <span>{{ (img.size && formatBytes(img.size) + (img.link ? ' (on hosting)' : '')) || 'Undefined size' }}</span>

            <v-text-field
              v-show="img.link"
              :value="img.link"
              label="Image Link"
            />

            <v-btn
              v-show="img.link"
              color="secondary"
              small
              @click="openInBrowser(img)"
            >
              Open in browser
            </v-btn>

            <!--<v-text-field-->
            <!--label="Direct Link"-->
            <!--/>-->
          </div>
        </v-card-title>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { shell } from 'electron'
import { formatBytes } from '@/helpers.js'

export default {
  props: {
    img: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    menu: false
  }),
  methods: {
    formatBytes,
    openInBrowser (img) {
      shell.openExternal(img.link)
    }
  }
}
</script>

<style lang="stylus">
  .img-preview
    border 1px solid

  .img-preview--with-link
    cursor: pointer
    transition all .5s

    &:hover
      transform scale(1.02)

  /*.image-uploaded*/
    /*border: 1px solid*/
    /*border-color green !important*/
</style>
