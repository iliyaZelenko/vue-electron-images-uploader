<template>
  <div>
    <input
      id="input-file"
      type="file"
      accept="image/*"
      multiple
    >

    <v-expand-transition>
      <label
        v-if="!uploaded"
        class="holder"
        for="input-file"
      >
        <div>
          <svg
            class="holder__icon"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="43"
            viewBox="0 0 50 43"
          >
            <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"/>
          </svg>
          <br><br>
          <h3>Choose a file(s) or drag it here.</h3>
        </div>
      </label>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  props: {
    uploaded: {
      type: Boolean,
      required: true
    }
  },
  mounted () {
    const holder = document.querySelector('.holder')
    const input = document.querySelector('#input-file')

    input.onchange = (e) => {
      this.$emit('addFiles', e.target.files)
      holder.classList.remove('holder--dragover')
    }

    holder.ondragover = () => {
      holder.classList.add('holder--dragover')
      return false
    }
    holder.ondragleave = holder.ondragend = () => {
      holder.classList.remove('holder--dragover')
      return false
    }
    holder.ondrop = e => {
      e.preventDefault()

      this.$emit('addFiles', e.dataTransfer.files)
    }
  }
}
</script>

<style lang="stylus">
  #input-file
    display none

  .holder
    background-color #c8dadf
    height 400px
    outline 2px dashed #92b0b3
    outline-offset -10px
    transition all .15s ease-in-out
    display flex !important
    justify-content center
    align-items center

    &:hover, &--dragover
      background-color #a5b7bc
      outline 2px dashed #648083
      color #444444
      cursor pointer

      .holder__icon
        fill #5f777a !important

    .holder__icon
      width 100%
      height 80px
      fill #92b0b3
      display block
      margin-bottom 40px
      transition all .15s ease-in-out
</style>
