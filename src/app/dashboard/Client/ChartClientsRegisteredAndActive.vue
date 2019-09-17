<template lang="pug">
  #chartClientsRegistered
    chart(
      title="Quantidade de clientes cadastrados ativos"
      :generateReportView="generateReportClientsRegisteredsAndActive"
      :generateReport="possuiItems"
      :options="optionsClientsRegistereds"
      )
      v-layout(row wrap slot="filters")
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
              v-model="filters.dateClientsRegistereds"
              @blur="date = parseMonth(filters.dateClientsRegistereds)"
              )
            v-date-picker(
              no-title
              scrollable
              type="month"
              locale="pt-br"
              v-model="date"
              color="primary"
              @click="menu = false"
              @input="filters.dateClientsRegistereds = monthFormattedBR(date)"
              )
</template>

<script>
import DashboardService from '@/services/DashboardService';
import Chart from '@/app/dashboard/Chart';
import moment from 'moment';
import DateFormatte from '@/mixins/date-formatte';

export default {
  name: 'charts-client-registered-and-active',
  components: {
    Chart,
  },
  mixins: [
    DateFormatte,
  ],
  data: () => ({
    DashboardService,
    menu: false,
    filters: {
      dateClientsRegistereds: moment().format('MM/YYYY'),
    },
    date: moment().format('YYYY-MM-DD'),
    optionsClientsRegistereds: {},
    columnsClientsRegistereds: [],
    dataClients: [],
  }),
  computed: {
    possuiItems() {
      const { dataClients } = this
      if (dataClients.length) {
        return !!dataClients.find((client) => {
          return client.smart > 0 || client.premium > 0;
        });
      }
      return false;
    },
  },
  created() {
    this.getCountClientsForChartActive();
  },
  methods: {
    getCountClientsForChartActive() {
      this.$loading.start();

      const { dateClientsRegistereds } = this.filters;
      const data = this.parseMonth(dateClientsRegistereds);

      DashboardService
        .facade()
        .getCountClientsForChartActive({ data })
        .then(({ data }) => {
          this.dataClients = data;
          this.columnsClientsRegistereds = [];
          this.mountOptionsClientsRegistereds();
          this.$loading.finish();
        });
    },
    mountOptionsClientsRegistereds() {
      const { dataClients } = this;
      let smarts = ['Smarts'];
      let premium = ['Premium'];
      let eixoX = [];

      dataClients.map((client, index) => {
        smarts.push(client.smart);
        premium.push(client.premium);
        eixoX.push(client.semana);
      });

      this.columnsClientsRegistereds.push(smarts, premium);

      this.optionsClientsRegistereds = {
        data: {
          columns: this.columnsClientsRegistereds,
          type: 'bar',
        },
        axis: {
          x: {
            type: 'category',
            categories: eixoX,
          },
        },
      };
    },
    generateReportClientsRegisteredsAndActive() {
      const { dateClientsRegistereds } = this.filters;
      const data = this.parseMonth(dateClientsRegistereds);
      this
        .$router
        .push({ name: 'report-clients-registered-and-active', query: { data } });
    },
  },
  watch: {
    filters: {
      handler(value) {
        this.getCountClientsForChartActive();
      },
      deep: true,
    },
  },
};
</script>
