<template lang="pug">
  #fotos-anunciante
    .crud-title.py-4 Fotos
    v-card
      v-container(grid-list-sm fluid)
        v-layout(row wrap)
          .body-2(v-if="!fotos.length") Não há fotos cadastradas
          v-flex(
            xs2
            d-flex
            :key="index"
            v-for="(urlFoto, index) in fotos"
          )
            v-card
              a(
                :href="urlFoto.url"
                target="_blank"
                )
                v-img.grey.lighten-2(
                  :src="urlFoto.url"
                  :lazy-src="urlFoto.url"
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
              v-card-actions(v-if="edit")
                v-spacer
                v-btn(small color="red" outline @click="removeFile(index)")
                  v-icon delete
          v-flex.mx-5(
            xs4
            v-if="edit"
          )
            input-image(
              size="md5"
              :arquivos.sync="fotos"
              @set-file="setFile($event)"
              hint="Insira a imagem"
            )
</template>

<script>
import InputImage from '@/components/InputImage.vue';

export default {
  name: 'anunciante-fotos-card',
  components: {
    InputImage,
  },
  props: {
    value: {
      type: [Object, Array],
      default: () => { return [{ url: '' }] },
    },
    id: {
      type: String,
    },
    versao: {
      type: Number,
      default: 0,
    },
    edit: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    removeFile(key) {
      this.fotos.splice(key, 1);
    },
    setFile(url) {
      const foto = {
        url: url,
        id: this.id,
      };
      this.fotos.push(foto);
    },
  },
  computed: {
    fotos: {
      get() {
        return this.value;
      },
      set() {
        return this.value;
      },
    },
  },
};
</script>

