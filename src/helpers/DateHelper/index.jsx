export default class DateHelper {

  static dateParaFormatoPtBr = (data) => {
    return ('0' + (data.getDate() + 1)).slice(-2) + "/" + ('0' + (data.getMonth() + 1)).slice(-2) + "/" + data.getFullYear();
  }

  static stringToDateStringISO8601 = (data) => {
    let rawISO = new Date(data).toISOString();
    return rawISO.substring(0,rawISO.length -2);
  }

  static stringToDateStringISO8601_inicioDia = (data) => {
    return DateHelper.stringToDateStringISO8601(data).substring(0,11) + '00:00:00';
  }

  static stringToDateStringISO8601_fimDia = (data) => {
    return DateHelper.stringToDateStringISO8601(data).substring(0,11) + '23:59:59';
  }

  static stringIsoParaJs = (dataHora) => {
    try {
      return new Date(dataHora + 'Z').getTime();
    } catch (e){
      console.log('Erro extraindo hora da data e hora (' + dataHora + ')');
      console.log(e);
    }
  }

}