<template lang="pug">
  #arquivo-anunciante
    .crud-title.py-4 Foto Perfil
    v-card
      v-container(grid-list-sm fluid)
        v-layout(row wrap)
          .body-2(v-if="!arquivo.url") Não há foto cadastrada
          v-flex(
            xs2
            d-flex
            v-if="arquivo.url"
          )
            v-card.d-flex(flat tile)
              a(
                :href="arquivo.url"
                target="_blank"
                )
                v-img.grey.lighten-2(
                  :src="arquivo.url"
                  :lazy-src="arquivo.url"
                  aspect-ratio="1"
                  )
                  v-layout(
                    ma-0
                    fill-height
                    align-center
                    justify-center
                    slot="placeholder"
                    )
                    v-progress-circular(
                      indeterminate
                      color="grey lighten-5"
                      )
          v-flex.mx-5(
            xs4
            v-if="edit"
          )
            input-image(
              size="md5"
              :arquivos.sync="arquivo"
              @set-file="setFile($event)"
              hint="Insira a imagem"
              :showImage="false"
            )
</template>

<script>
import InputImage from '@/components/InputImage.vue';

export default {
  name: 'anunciante-arquivo-card',
  components: {
    InputImage,
  },
  props: {
    value: {
      type: Object,
      default: () => { return { url: '' } },
    },
    id: {
      type: String,
    },
    edit: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    setFile(url) {
      this.arquivo.url = url;
    },
  },
  computed: {
    arquivo: {
      get() {
        return this.value || { url: '' };
      },
      set() {
        return this.value.url;
      },
    },
  },
};
</script>

