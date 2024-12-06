import moment from "moment";
export function formatedDate(date?: Date | string | number) {
    return moment(date).format("MM/DD/YYYY");
  }