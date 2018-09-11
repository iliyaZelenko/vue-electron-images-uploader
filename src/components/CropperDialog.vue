<template>
  <!--max-width="300"-->
  <!--v-model="editDialog"-->
  <v-dialog
    :value="value"
    @input="$emit('input', arguments[0])"
  >
    <v-card>
      <v-card-title class="headline">
        Edit image
      </v-card-title>
      <v-card-text>
        <cropper
          v-if="editableImage"
          :image="editableImage"
          @crop="$emit('setEditBlob', arguments[0])"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          flat
          @click="$emit('stopEditFile')"
        >
          Close
        </v-btn>
        <v-btn
          :loading="editSaveLoading"
          color="primary"
          flat
          @click="$emit('saveEditFile')"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Cropper from '@/components/Cropper'

export default {
  components: { Cropper },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    editableImage: {
      type: Object,
      default: () => ({})
    },
    editSaveLoading: {
      type: Boolean,
      required: true
    }
    // editDialog: {
    //   type: Boolean,
    //   required: true
    // }
  }
}
</script>
