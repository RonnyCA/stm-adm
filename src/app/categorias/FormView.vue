<template lang="pug">
  #categoria-form-view
    .crud-title.pb-4 {{ title }}
    v-form(
      ref="form"
      @submit="saveCategoria()"
      )
      v-card.pb-2
        v-card-text
          v-container.pa-0(grid-list-md)
            v-layout(row wrap align-center).px-2
              v-text-field(
                label="Título"
                v-model="categoria.titulo"
                :rules="[rules.required]"
                )
              v-btn.mb-3.mr-0(
                color="accent"
                @click="addSegmento()"
                ) Adicionar Segmento
            v-layout(row wrap align-center).px-2
              v-flex(
                xs2
                v-for="(segmento, index) in segmentos"
                :key="index"
                )
                v-text-field(
                  append-icon="close"
                  label="Segmento"
                  v-model="segmentos[index].descricao"
                  @click:append="removeSegmento(index)"
                  )
        v-card-actions.px-3
          v-spacer
          v-btn(
            flat
            @click.stop="questionBack()"
            :disabled="$loading.isLoading"
            ) Cancelar
          v-btn(
            outline
            type="submit"
            color="primary"
            :disabled="$loading.isLoading"
            ) Concluir
</template>

<script>
import CategoriaService from '@/services/CategoriaService';

export default {
  name: 'categorias-form-view',

  data: () => ({
    categoria: {
      segmentos: [],
    },
    rules: {
      required: v => !!v || 'Campo obrigatório',
    },
  }),

  computed: {
    isEdit() {
      return !!this
        .categoria
        .id;
    },
    title() {
      return this.isEdit
        ? 'Edição de categoria'
        : 'Nova categoria';
    },
    segmentos() {
      return this
        .categoria
        .segmentos;
    },
  },

  created() {
    const { categoria_id: categoriaId } = this.$route.params;
    if (categoriaId) {
      this.loadCategoria(categoriaId);
    }
  },

  notifications: {
    showSuccess: {
      title: 'Sucesso',
      message: 'Categoria salva com sucesso!',
      type: 'success',
    },
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao gravar.',
      type: 'error',
    },
  },

  methods: {
    mapSegments(segmentos) {
      return segmentos.map(segmento => segmento.descricao);
    },
    removeSegmento(index) {
      this
        .segmentos
        .splice(index, 1);
    },
    newSegmentoModel() {
      return {
        descricao: '',
      };
    },

    addSegmento() {
      if (this.categoria.segmentos.length) {
        const indexNaoPreenchido = this
          .categoria
          .segmentos
          .findIndex((segmento) => {
            return segmento.descricao ===  '';
          })

        if(indexNaoPreenchido > -1) {
          return this.showError({
            title: 'Erro',
            message: 'Para adicionar outro segmento não deixe nenhum segmento vazio!'
          });
        }
      }
      const newSegmentoModel = this.newSegmentoModel();
      this
        .categoria
        .segmentos
        .push(newSegmentoModel);
    },
    formIsValid() {
      return this
        .$refs
        .form
        .validate();
    },
    loadCategoria(id) {
      this.$loading.start();

      CategoriaService
        .facade()
        .find(id)
        .then(({ data }) => {
          const { item } = data;
          this.categoria = item;
          this.$loading.finish();
        })
        .catch(() => {
          this.$loading.finish();
          this.showError({
            message: 'Ocorreu um erro ao obter os dados da categoria.',
          });
        });
    },
    questionBack() {
      const options = {
        title: 'Atenção',
        text: 'Deseja realmente cancelar essa operação?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
      };

      this
        .$swal(options)
        .then((result) => {
          if(!result.value) {
            return false;
          }
          return this.goToList();
        });
    },
    goToList() {
      this
        .$router
        .push('/categorias');
    },
    saveCategoria() {
      if (!this.formIsValid()) {
        return false;
      }

      return this.isEdit
        ? this.saveEditCategoria()
        : this.saveNewCategoria();
    },
    saveEditCategoria() {
      const categoria = { ...this.categoria };
      const { id } = categoria;
      categoria.segmentos = this.mapSegments(categoria.segmentos);
      this.$loading.start();

      return CategoriaService
        .facade()
        .edit(id, categoria)
        .then(() => {
          this.$loading.finish();
          this.showSuccess({ message: 'Categoria editada com sucesso!' });
          this.goToList();
        })
        .catch(({ data }) => {
          this.$loading.finish();
          this.showError({ message: data });
        });
    },
    saveNewCategoria() {
      const categoria = { ...this.categoria };
      categoria.segmentos = this.mapSegments(categoria.segmentos);
      this.$loading.start();

      return CategoriaService
        .facade()
        .add(categoria)
        .then(() => {
          this.$loading.finish();
          this.showSuccess({ message: 'Categoria cadastrada com sucesso!' });
          this.goToList();
        })
        .catch(({ data }) => {
          this.$loading.finish();
          this.showError({
            title: 'Erro',
            message: 'Campo segmento em branco!',
          });
        });
    },
  },
};
</script>
