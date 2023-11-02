export default class DateHelper {

  static dateParaFormatoPtBr = (data) => {
    return ('0' + (data.getDate() + 1)).slice(-2) + "/" + ('0' + (data.getMonth() + 1)).slice(-2) + "/" + data.getFullYear();
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