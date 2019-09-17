<template lang="pug">
  v-container#inputImage.pa-0(grid-list-lg align-content justify-center)
    v-layout(row wrap)
      v-flex(:class="size")
        v-text-field(
          readonly
          label="Imagem"
          v-model="fileName"
          @click="launchFilePicker()"
          :rules="imagesRules"
          append-icon="cloud_upload"
          @click:append="launchFilePicker()"
          :hint="hint"
          persistent-hint
          )
    v-layout(row wrap v-if="hasImage")
      v-flex(
        xs12
        sm6
        md3
        v-if="multiple"
        v-for="(image, key) in images"
        :key="key"
        )
        v-card.elevation-2
          a(:href="image.url" target="_blank")
            v-img.banner__imagem(:src="image.url" aspect-ratio="1.5")
          v-card-actions
            v-spacer
            v-btn(small color="red" outline @click="removeFile(key)")
              v-icon delete
      v-flex(
        xs12
        sm6
        md3
        v-if="!multiple && showImage"
        )
        v-card.elevation-2
          a(:href="image.url" target="_blank")
            v-img.banner__imagem(:src="image.url" aspect-ratio="1.5")
    input.invisible(
      type="file"
      ref="files"
      :multiple="multiple"
      accept="image/*"
      @change="getFileData($event)"
      )
</template>

<script>
import UploadService from '@/services/UploadService';

export default {
  name: 'input-image',

  props: {
    size: {
      type: String,
      default: 'xs3',
    },
    arquivos: {
      type: [Object, Array],
      required: true,
    },
    imagesRules: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: '',
    },
    showImage: {
      type: Boolean,
      default: true
    }
  },

  data: () => ({
    fileName: '',
    image: {
      url: ''
    },
    images: [],
  }),

  computed: {
    hasImage() {
      if (this.multiple && this.arquivos.length) {
        return !!this.images[0].url;
      }
      return !!this.image.url;
    },
  },

   notifications: {
    showSuccess: {
      title: 'Sucesso',
      message: 'Plano salvo com sucesso!',
      type: 'success',
    },
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao gravar.',
      type: 'error',
    },
  },

  methods: {
    removeFile(key) {
      this.images.splice(key, 1);
    },
    launchFilePicker() {
      this
        .$refs
        .files
        .click();
    },
    getFileData(event) {
      const { files } = event.target

      Array.prototype.forEach.call(files, (file) => {
        this.fileName = file.name;
        this.getUrlFile(file);
      });
    },
    getUrlFile(file) {
      UploadService
        .facade()
        .uploadFile(file)
        .then(({ data }) => {
          const { url } = data;
          if (!this.multiple) {
            this
              .image
              .url = url;
          }
          this.$emit('set-file', url);
        })
        .catch((data) => {
          this.showError({
            message: data,
          });
        });
    },
  },
  watch: {
    arquivos: {
      handler(value) {
        if (this.multiple) {
          return this.images = value;
        }
        this.image.url = value.url;
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus">
#inputImage
  .invisible
    display none

  .icon-remove
    position fixed

  .banner__imagem
    position relative
    text-align center
    .v-image__image
      background-size contain !important
</style>
