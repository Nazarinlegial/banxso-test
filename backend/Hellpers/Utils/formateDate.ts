import dayjs from "dayjs";

export function  dateFormat() {
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
}