<template lang="pug">
  #financas-form-view
    .crud-title.pb-4 Finanças
    v-form(
      ref="form"
      v-model="valid"
      lazy-validation
      @submit="save()"
      )
      v-card.pb-2
        v-card-text
          v-container.pa-0(grid-list-md)
            v-layout(row wrap justify-space-between)
              v-flex(md4 xs12)
                v-text-field(
                  label="Taxa de conversão - Smarts/1 Real"
                  v-money="smarts"
                  :rules="[rules.validaFinancas]"
                  ref="cotacaoSmart"
                  v-model.lazy="financas.cotacao_smarts"
                  )
              v-flex(md4 xs12)
                v-text-field(
                  label="Limite mínimo para resgate"
                  v-money="money"
                  ref="limiteMinimoResgate"
                  :rules="[rules.validaFinancas]"
                  v-model.lazy="financas.limite_min_resgate"
                  )
              v-flex(md4 xs12)
                v-text-field(
                  :rules="regraValorMaximoResgate"
                  v-money="money"
                  label="Limite máximo para resgate"
                  v-model.lazy="financas.limite_max_resgate"
                  ref="limiteMaximoResgate"
                  )
              v-flex(md4 xs12)
                v-text-field(
                  ref="limiteMinimoComissaoAcumulada"
                  v-money="money"
                  :rules="[rules.validaFinancas]"
                  label="Limite mínimo de comissão acumulada"
                  v-model="financas.limite_min_de_comissao_acumulada"
                  )
              v-flex(md4 xs12)
                v-text-field(
                  ref="limiteMaximoComissaoAcumulada"
                  v-money="money"
                  :rules="regraValorMaximoComissao"
                  label="Limite máximo de comissão acumulada"
                  v-model="financas.limite_max_de_comissao_acumulada"
                  )
              v-flex(md4 xs12)
                v-text-field(
                  type="number"
                  :rules="[rules.prazo_de_pagamento, rules.prazo_maior_que_1]"
                  label="Prazo de pagamento"
                  v-model="financas.prazo_de_pagamento"
                  )
              v-flex(xs12)
                input-image(
                  size="md4"
                  :multiple="true"
                  :arquivos.sync="financas.imagens"
                  @set-file="setFile($event)"
                  hint="Deve ser adicionado no máximo 5 imagens com tamanho: 360x185"
                )
          v-card-actions.px-3
            v-spacer
            v-btn(
              type="submit"
              outline
              color="primary"
              :disabled="!valid || $loading.isLoading"
              ) Salvar
</template>

<script>
import FinancasService from '@/services/FinancasService';
import InputImage from '@/components/InputImage.vue';

export default {
  name: 'financas-form-view',

  components: {
    InputImage,
  },

  data: () => ({
    valid: true,

    money: {
      decimal: ',',
      thousands: '.',
      precision: 2,
      prefix: 'R$ ',
      masked: false,
    },
    smarts: {
      decimal: ',',
      thousands: '.',
      precision: 2,
      masked: false,
    },
    rules: {
      validaFinancas: v => !!v && v !== 'R$ 0,00' || 'Campo é obrigatório',
      prazo_de_pagamento: v => !!v || 'Campo é obrigatório',
      prazo_maior_que_1: v => v >= 1 || 'Campo deve ser superior ou igual a 1',
    },
    financas: {
      imagens: [],
    },
  }),

  computed: {
    columnFields() {
      return this
        .$vuetify
        .breakpoint
        .mdAndUp;
    },
    regraValorMaximoResgate() {
      const { limite_min_resgate: limiteMinResgate } = this.financas;
      let value = limiteMinResgate;
      let valid = true;
      return [
        (v) => {
          if (!v || typeof v === 'undefined' || v === 'R$ 0,00') {
            return 'Campo é obrigatório';
          }

          if (v) {
            v = this.numberConvert(String(v));
            valid = v >= 1 || 'O valor deve ser superior ou igual a 1';
          }
          if (typeof value !== 'undefined' && v >= 1) {
            v = this.numberConvert(String(v));
            value = this.numberConvert(String(value));
            valid = v >= value || 'O valor inserido não pode ser inferior ao valor mínimo';
          }
          return valid;
        },
      ];
    },
    regraValorMaximoComissao() {
      const {
        limite_min_de_comissao_acumulada: limiteMinDeComissaoAcumulada,
      } = this.financas;
      let value = limiteMinDeComissaoAcumulada;
      let valid = true;
      return [
        (v) => {
          if (typeof v === 'undefined' || !v || v === 'R$ 0,00') {
            return 'Campo é obrigatório';
          }

          if (v) {
            v = this.numberConvert(String(v));
            valid = v >= 1 || 'O valor deve ser superior ou igual a 1';
          }

          if (typeof value !== 'undefined' && v >= 1) {
            v = this.numberConvert(String(v));
            value = this.numberConvert(String(value));
            valid = v >= value || 'O valor inserido não pode ser inferior ao valor mínimo';
          }
          return valid;
        },
      ];
    },
  },

  created() {
    this.loadData();
  },

  notifications: {
    showSuccess: {
      title: 'Sucesso',
      message: 'Operação realizada com sucesso!',
      type: 'success',
    },
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao realizar operação.',
      type: 'error',
    },
  },

  methods: {
    numberConvert(campo) {
      const removerPrefixo = campo.replace(/R. /g, '');
      const removerPonto = removerPrefixo.replace(/\./g, '');
      const formatar = removerPonto.replace(',', '.');
      return Number(formatar);
    },
    formIsValid() {
      return this
        .$refs
        .form
        .validate();
    },
    save() {
      if (!this.formIsValid()) {
        return;
      }

      this.$loading.start();
      const { financas } = this;
      const cotacaoSmartCopy = this.numberConvert(financas.cotacao_smarts);
      const limiteMinResgate = this.numberConvert(financas.limite_min_resgate);
      const limiteMaxResgate = this.numberConvert(financas.limite_max_resgate);
      const limiteMinComissaoAcumulada =
        this.numberConvert(financas.limite_min_de_comissao_acumulada);
      const limiteMaxComissaoAcumulada =
        this.numberConvert(financas.limite_max_de_comissao_acumulada);
      financas.cotacao_smarts = cotacaoSmartCopy;
      financas.limite_max_resgate = limiteMaxResgate;
      financas.limite_min_resgate = limiteMinResgate;
      financas.limite_min_de_comissao_acumulada = limiteMinComissaoAcumulada;
      financas.limite_max_de_comissao_acumulada = limiteMaxComissaoAcumulada;

      FinancasService
        .facade()
        .save(financas)
        .then(() => {
          this.showSuccess();
          this.loadData();
          this.$loading.finish();
        })
        .catch(({ data }) => {
          this.$loading.finish();
          if (data) {
            this.showError({
              message: data.message,
            });
            this.$loading.finish();
            return;
          }
          this.showError();
          this.$loading.finish();
        });
    },
    setFile(url) {
      this
        .financas
        .imagens
        .push({ url });
    },
    loadData() {
      this.$loading.start();

      FinancasService
        .facade()
        .find()
        .then(({ data }) => {
          this.$refs.cotacaoSmart.$el.getElementsByTagName('input')[0].value = data.cotacao_smarts.toFixed(2);
          this.$refs.limiteMinimoResgate.$el.getElementsByTagName('input')[0].value =
          data.limite_min_resgate.toFixed(2);
          this.$refs.limiteMaximoResgate.$el.getElementsByTagName('input')[0].value =
          data.limite_max_resgate.toFixed(2);
          this.$refs.limiteMinimoComissaoAcumulada.$el.getElementsByTagName('input')[0].value =
          data.limite_min_de_comissao_acumulada.toFixed(2);
          this.$refs.limiteMaximoComissaoAcumulada.$el.getElementsByTagName('input')[0].value =
          data.limite_max_de_comissao_acumulada.toFixed(2);
          this.financas = data;
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
  },
};
</script>
