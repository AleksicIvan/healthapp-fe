import dayjs from 'dayjs'

const getTimeNow = _ => dayjs().format('DD.MM.YYYY, HH:mm:ss')

export {
  getTimeNow
}