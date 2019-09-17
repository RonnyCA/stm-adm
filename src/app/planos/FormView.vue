<template lang="pug">
  #plano-form-view
    .crud-title.pb-4 {{ title }}
    v-form(
      ref="form"
      v-model="valid"
      @submit="savePlano()"
      lazy-validation
      )
      v-card.pb-2
        v-card-text
          v-container.pa-0(grid-list-md)
            v-layout(row wrap align-center).px-2
              v-flex(xs12)
                v-text-field(
                  label="Título"
                  v-model="plano.titulo"
                  :rules="[rules.required]"
                  maxlength="100"
                  )
              v-flex(xs4)
                v-text-field(
                  label="Porcentagem Mínima"
                  v-model="plano.porcentagem_minima"
                  :rules="porcentagemRules"
                  type="number"
                  )
              v-flex(xs4)
                v-text-field(
                  label="Porcentagem Máxima"
                  v-model="plano.porcentagem_maxima"
                  :rules="maximumPercentRules"
                  type="number"
                  )
              v-flex(xs4)
                v-text-field(
                  label="Quantidade de publicações"
                  v-model="plano.numero_publicacoes"
                  :rules="publicacoesRules"
                  type="number"
                  )
              v-flex(xs12)
                v-textarea(
                  label="Descrição"
                  placeholder="Digite uma descrição..."
                  no-resize
                  rows="3"
                  v-model="plano.descricao"
                  counter
                  maxlength="300"
                  :rules="[rules.required]"
                  )
              v-flex(xs12)
                input-image(
                  :arquivos.sync="plano.arquivo"
                  :imagesRules="imageRules"
                  @set-file="setFile($event)"
                )
        v-card-actions.px-3
          v-spacer
          v-btn(
            flat
            @click.stop="cancelOperation()"
            :disabled="$loading.isLoading"
            ) Cancelar
          v-btn(
            outline
            color="primary"
            type="submit"
            :disabled="!valid || $loading.isLoading"
            ) Salvar
</template>

<script>
import PlanosService from '@/services/PlanosService';
import InputImage from '@/components/InputImage.vue';

export default {
  name: 'plano-form-view',

  components: {
    InputImage,
  },

  data: vm => ({
    valid: true,
    fileName: '',
    plano: {
      arquivo: {},
    },
    rules: {
      required: v => !!v || 'Campo obrigatório',
      moreThenOne: v => v >= 1 || 'O valor deve ser superior ou igual a 1',
      lessThenHundred: v => v <= 100 || 'O valor deve ser inferior a 100',
      notEquals: v => vm.isEquals(v) || 'As porcentagens não podem ser iguais',
      lessThenMinimum: v => vm.isLessThenMinimum(v) || 'O valor inserido não pode ser inferior ao valor mínimo',
    },
  }),
  computed: {
    publicacoesRules() {
      return [
        this.rules.required,
        this.rules.moreThenOne,
      ];
    },
    porcentagemRules() {
      return [
        this.rules.required,
        this.rules.moreThenOne,
        this.rules.lessThenHundred,
      ];
    },
    maximumPercentRules() {
      return [
        this.rules.required,
        this.rules.moreThenOne,
        this.rules.lessThenHundred,
        this.rules.lessThenMinimum,
        this.rules.notEquals,
      ];
    },
    imageRules() {
      const { isEdit, rules } = this;
      return isEdit
        ? []
        : [rules.required];
    },
    isEdit() {
      return !!this
        .plano
        .id;
    },
    title() {
      const { isEdit } = this;
      return isEdit
        ? 'Edição de plano'
        : 'Novo plano';
    },  
  },

  created() {
    const { plano_id: planId } = this.$route.params;
    if (planId) {
      this.loadPlan(planId);
    }
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
    isEquals(value) {
      const maximum = this.plano.porcentagem_minima || 0;
      return !(value == maximum);
    },
    isLessThenMinimum(value) {
      value = parseFloat(value);
      const minimum = this.plano.porcentagem_minima || 0;
      return (value >= minimum);
    },
    setFile(url) {
      this
        .plano
        .arquivo
        .url = url;
    },
    formIsValid() {
      return this
        .$refs
        .form
        .validate();
    },
    loadPlan(id) {
      this.$loading.start();

      PlanosService
        .facade()
        .find(id)
        .then(({ data }) => {
          this.plano = data.item;
          this.$loading.finish();
        })
        .catch(() => {
          this.$loading.finish();
          this.showError({
            message: 'Ocorreu um erro ao obter os dados do plano.',
          });
        });
    },
    goToList() {
      return this
        .$router
        .push('/planos');
    },
    cancelOperation() {
      const options = {
        title: 'Atenção',
        text: 'Deseja realmente cancelar a operação?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
      };
      this
        .$swal(options)
        .then((result) => {
          if (!result.value) {
            return false;
          }

          return this
            .$router
            .push('/planos');
        });
    },
    savePlano() {
      if (this.formIsValid()) {
        return this.isEdit
          ? this.saveEditPlan()
          : this.saveNewPlan();
      }
      return false;
    },
    saveEditPlan() {
      const { plano } = this;
      const { id } = plano;
      this.$loading.start();

      return PlanosService
        .facade()
        .edit(id, plano)
        .then(() => {
          this.$loading.finish();
          this.showSuccess({ message: 'Plano editado com sucesso!' });
          this.goToList();
        })
        .catch(({ data }) => {
          this.$loading.finish();
          this.showError({ message: data });
        });
    },
    saveNewPlan() {
      const { plano } = this;
      this.$loading.start();

      return PlanosService
        .facade()
        .add(plano)
        .then(() => {
          this.$loading.finish();
          this.showSuccess({ message: 'Plano cadastrado com sucesso!' });
          this.goToList();
        })
        .catch(({ data }) => {
          this.$loading.finish();
          this.showError({ message: data.message });
        });
    },
  },
};
</script>

<style lang="stylus">
.preview
  padding 20px

img.imageBoxPreview
  width 200px
  padding 5px
  border 1px dashed darkgrey
  background-color #fafafa
  stroke black
  stroke-dasharray 5

.invisible
  display none

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance none
input[type=number]
  -moz-appearance textfield

</style>
