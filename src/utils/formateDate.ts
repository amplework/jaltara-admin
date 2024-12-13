import moment from 'moment';
export function formatedDate(date?: Date | string | number) {
  return moment(date).format('MM/DD/YYYY');
}

export function formatedDateTime(date?: Date | string | number) {
  return moment(date).format('MM/DD/YYYY hh:mm a');
}
