import moment from 'moment';

export function dateFormatteBR(date) {
  moment.locale('pt-br');
  if (!date) {
    return moment().format('l');
  }

  return moment(date, 'YYYY-MM-DD').format('l');
}
