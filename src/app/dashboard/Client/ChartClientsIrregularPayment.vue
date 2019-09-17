<template lang="pug">
  #chartClientsActive
    chart(
      title="Quantidade de clientes com pagamento irregular"
      :generateReportView="generateReportPaymentIrregular"
      :generateReport="possuiItems"
      :options="optionsIrregularPayments"
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
              v-model="filters.dateIrregularPayment"
              @blur="date = parseMonth(filters.dateIrregularPayment)"
              )
            v-date-picker(
              no-title
              scrollable
              type="month"
              locale="pt-br"
              v-model="date"
              color="primary"
              @click="menu = false"
              @input="filters.dateIrregularPayment = monthFormattedBR(date)"
              )
</template>

<script>
import DashboardService from '@/services/DashboardService';
import Chart from '@/app/dashboard/Chart';
import moment from 'moment';
import DateFormatte from '@/mixins/date-formatte';

export default {
  name: 'charts-client-irregular-payment',
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
      dateIrregularPayment: moment().format('MM/YYYY'),
    },
    date: moment().format('YYYY-MM'),
    optionsIrregularPayments: {},
    columnsIrregularPayments: [],
    dataClients: [],
  }),
  computed: {
    possuiItems() {
      const { dataClients } = this

      if (dataClients.length) {
        return !!dataClients.find((client) => {
          return client.irregular > 0 || client.regular > 0;
        });
      }
      return false;
    },
  },
  created() {
    this.getCountClientsForIrregularPayment();
  },
  methods: {
    getCountClientsForIrregularPayment() {
      this.$loading.start();

      const { dateIrregularPayment } = this.filters;
      const data = this.parseMonth(dateIrregularPayment);

      DashboardService
        .facade()
        .getCountClientsForIrregularPayment({ data })
        .then(({ data }) => {
          this.dataClients = data;
          this.columnsIrregularPayments = [];
          this.mountOptionsIrregularPayment();
          this.$loading.finish();
        });
    },
    mountOptionsIrregularPayment() {
      const { dataClients } = this;
      let irregulares = ['Irregulares'];
      let eixoX = [];

      dataClients.map((client, index) => {
        irregulares.push(parseInt(client.irregular, 10));
        eixoX.push(client.semana);
      });

      this.columnsIrregularPayments.push(irregulares);

      this.optionsIrregularPayments = {
        data: {
          columns: this.columnsIrregularPayments,
        },
        axis: {
          x: {
            type: 'category',
            categories: eixoX,
          },
        },
        zoom: {
          enabled: true,
        },
      };
    },
    generateReportPaymentIrregular() {
      const { dateIrregularPayment } = this.filters;
      const data = this.parseMonth(dateIrregularPayment);
      this
        .$router
        .push({ name: 'report-clients-irregular-payment', query: { data } })
    },
  },
  watch: {
    filters: {
      handler(value) {
        this.getCountClientsForIrregularPayment();
      },
      deep: true,
    },
  },
};
</script>
