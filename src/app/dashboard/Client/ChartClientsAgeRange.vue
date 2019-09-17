<template lang="pug">
  #chartClientsAgeRange
    chart(
      title="Quantidade de clientes por gênero e faixa etária"
      :options="optionsHorizontalAgeRange"
      :showCardActions="false"
      )
      v-layout(row wrap slot="filters")
        v-flex(md3 xs12)
          v-autocomplete(
            label="Tipo do Cliente"
            :items="typesClients"
            v-model="typeClient"
            )
        v-flex(md3 xs12)
          v-menu(
            lazy
            offset-y
            ref="menu"
            full-width
            v-model="menu"
            max-width="290px"
            min-width="290px"
            transition="scale-transition"
            )
            v-text-field(
              readonly
              label="Mês"
              slot="activator"
              prepend-icon="event"
              v-model="filters.dateHorizontalAgeRange"
              @blur="date = parseMonth(filters.dateHorizontalAgeRange)"
              )
            v-date-picker(
              no-title
              scrollable
              type="month"
              locale="pt-br"
              v-model="date"
              color="primary"
              @click="menu = false"
              @input="filters.dateHorizontalAgeRange = monthFormattedBR(date)"
              )
</template>

<script>
import DashboardService from '@/services/DashboardService';
import Chart from '@/app/dashboard/Chart';
import moment from 'moment';
import Vue from 'vue';
import DateFormatte from '@/mixins/date-formatte';

export default {
  name: 'charts-client-age-range',
  components: {
    Chart,
  },
  mixins: [
    DateFormatte,
  ],
  data: () => ({
    DashboardService,
    typesClients: [
      { text: 'Todos', value: null },
      { text: 'Smart', value: 'smart' },
      { text: 'Premium', value: 'premium' },
    ],
    menu: false,
    filters: {
      dateHorizontalAgeRange: moment().format('MM/YYYY'),
    },
    typeClient: null,
    date: moment().format('YYYY-MM'),
    optionsHorizontalAgeRange: {},
    columnsHorizontalAgeRange: [],
    dataClients: [],
  }),
  created() {
    const { dateHorizontalAgeRange } = this.filters;
    const date = this.parseMonth(dateHorizontalAgeRange);
    this.getCountClientsForChartHorizontalAgeRange(date);
  },
  notifications: {
    showError: {
      title: 'Deu ruim',
      message: 'Ocorreu um erro ao tentar pegar os dados do mockAPI!!',
      type: 'error',
    },
  },
  methods: {
    getCountClientsForChartHorizontalAgeRange(data) {
      this.$loading.start();

      DashboardService
        .facade()
        .getCountClientsForChartHorizontalAgeRange({ data })
        .then(({ data: { faixas } }) => {
          this.dataClients = faixas;
          this.columnsHorizontalAgeRange = [];
          this.mountOptionsHorizontalAgeRange();
          this.$loading.finish();
        });
    },
    mountOptionsHorizontalAgeRange() {
      if (this.typeClient) {
        return this.mountOptionsHorizontalAgeRangeOnTypeClientFilter();
      }

      const { dataClients } = this;
      let masculino = ['Masculino'];
      let feminino = ['Feminino'];
      let naoDefinido = ['Não informado'];
      let eixoY = [];

      dataClients.map((client, index) => {
        const { smart } = client;
        const { premium } = client;
        const { inicial } = client;
        const { final } = client;

        masculino.push(parseInt(smart.masculino) + parseInt(premium.masculino));
        feminino.push(parseInt(smart.feminino) + parseInt(premium.feminino));
        naoDefinido.push(parseInt(smart.nao_definido) + parseInt(premium.nao_definido));
        eixoY.push(`${inicial} a ${final}`);
      });

      this.columnsHorizontalAgeRange.push(masculino, feminino, naoDefinido);

      this.optionsHorizontalAgeRange = {
        data: {
          columns: this.columnsHorizontalAgeRange,
          type: 'bar',
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            categories: eixoY,
          },
        },
      };
    },
    mountOptionsHorizontalAgeRangeOnTypeClientFilter() {
      const { dataClients, typeClient } = this
      let masculino = ['Masculino'];
      let feminino = ['Feminino'];
      let naoDefinido = ['Não informado'];
      let eixoY = [];

      dataClients.map((client, index) => {
        const { inicial } = client;
        const { final } = client;

        masculino.push(client[typeClient].masculino);
        feminino.push(client[typeClient].feminino);
        naoDefinido.push(client[typeClient].nao_definido);
        eixoY.push(`${inicial} a ${final}`);
      });

      this.columnsHorizontalAgeRange.push(masculino, feminino, naoDefinido);

      this.optionsHorizontalAgeRange = {
        data: {
          columns: this.columnsHorizontalAgeRange,
          type: 'bar',
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            categories: eixoY,
          },
        },
      };
    },
  },
  watch: {
    filters: {
      handler(value) {
        const { dateHorizontalAgeRange } = value;
        const date = this.parseMonth(dateHorizontalAgeRange);
        this.getCountClientsForChartHorizontalAgeRange(date);
      },
      deep: true,
    },
    typeClient: {
      handler(value) {
        if (this.dataClients) {
          this.columnsHorizontalAgeRange = [];
          this.mountOptionsHorizontalAgeRange()
        }
      },
      immediate: true,
    },
  },
};
</script>
