import moment from 'moment';
export default {
  methods: {
    parseMonth(date = null) {
      if (!date) {
        return moment().format('YYYY-MM-DD');
      }
      return moment(date, 'MM/YYYY').format('YYYY-MM-DD');
    },
    monthFormattedBR(date = null) {
      if (!date) {
        return moment().format('MM/YYYY');
      }
      return moment(date, 'YYYY-MM').format('MM/YYYY');
    },
    dateFormattedBr(date = null) {
      moment.locale('pt-br')
      if(!date) {
        return moment().format('l');
      }
      return moment(date).format('l');
    },
    parseDate(date = null) {
      if (!date) {
        return moment().format('YYYY-MM-DD');
      }
      return moment(date, 'dddd').format('DD/MM/YYYY');
    }
  }
}
