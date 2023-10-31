export default class DateHelper {

  static dateParaFormatoPtBr = (data) => {
    return ('0' + (data.getDate() + 1)).slice(-2) + "/" + ('0' + (data.getMonth() + 1)).slice(-2) + "/" + data.getFullYear();
  }

}