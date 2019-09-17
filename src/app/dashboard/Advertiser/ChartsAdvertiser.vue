<template lang="pug">
  #chartsAdvertiser
    chart-advertiser-registered
    chart-advertiser-active
    chart-advertiser-per-plan(
      :planos="planos"
      )
    chart-advertiser-pending-approval
    chart-advertiser-irregular-payment(
      :planos="planos"
      :categorias="categorias"
      )
</template>

<script>
import ChartAdvertiserPerPlan from './ChartAdvertiserPerPlan';
import ChartAdvertiserActive from './ChartAdvertiserActive';
import ChartAdvertiserRegistered from './ChartAdvertiserRegistered';
import ChartAdvertiserPendingApproval from './ChartAdvertiserPendingApproval';
import ChartAdvertiserIrregularPayment from './ChartAdvertiserIrregularPayment';
import PlanoService from '@/services/PlanosService';
import CategoriaService from '@/services/CategoriaService';

export default {
  components: {
    ChartAdvertiserPerPlan,
    ChartAdvertiserActive,
    ChartAdvertiserRegistered,
    ChartAdvertiserPendingApproval,
    ChartAdvertiserIrregularPayment,
  },

  data: () => ({
    PlanoService,
    planos: [],
    categorias: [],
  }),

  created() {
    this.getAllPlan();
    this.getAllCategories();
  },

  notifications: {
    showError: {},
  },

  methods: {
    getAllPlan() {
      this.$loading.start();

      PlanoService
        .facade()
        .getPlans()
        .then(( { data }) => {
          data.map((plano) => {
            this.planos.push({
              text: plano.titulo,
              value: plano.id
            });
          })
        })
        .catch(({ status }) => {
          if (status === 500) {
            this.showError({
              type: 'error',
              title: 'Falha ao buscar os planos'
            });
          }
          this.$loading.finish();
        });
    },
    getAllCategories() {
      this.$loading.start();
      
      CategoriaService
        .facade()
        .findAllWithoutPaginate()
        .then(({ data }) => {
          data.map((categoria) => {
            this.categorias.push({
              text: categoria.titulo,
              value: categoria.id,
            });
          })
          this.$loading.finish();
        })
        .catch(({ status }) => {
          if (status === 500) {
            this.showError({
              type: 'error',
              title: 'Falha ao buscar as categorias'
            });
          }
          this.$loading.finish();
        });
    },
  },
};
</script>

