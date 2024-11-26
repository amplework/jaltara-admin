import moment from "moment";
export function formatedDate(date?: Date | string | number) {
    return moment(date).format("DD-MM-YYYY");
  }