import moment from 'moment';
import 'moment/locale/pt-br';

String.prototype.replaceAll = function(de, para){

}

export const replaceAll = (value, from, to) => {
  let oldValue = value == null ? '' : String(value);

  let str = oldValue.toString();
	let pos = str.indexOf(from);
	while (pos > -1){
		str = str.replace(from, to);
		pos = str.indexOf(from);
	}

	return (str);
}

export const formatValue = ({ value, separator = '.', currency = '', locale = 'pt-BR', decimal = true, maxFractionDigitis = 2 }) => {
  var valueFormated = '0.00';

  if (currency !== '') {
    valueFormated = Intl.NumberFormat(locale, {style: 'currency', currency: currency, maximumFractionDigits: maxFractionDigitis}).format(parseFloat(value ? value : 0));
  } else {
    let oldValue = value == null ? '' : String(value);
    if (decimal && value !== '') {
      var valueSplit = oldValue.split('.');
      if (typeof valueSplit[1] === 'undefined' || valueSplit[1].length === 1) {
        if (typeof valueSplit[1] === 'undefined') {
          valueSplit[1] = '00';
        } else {
          valueSplit[1] = `${valueSplit[1]}0`;
        }
      }
      oldValue = valueSplit.join('.');
    }
    valueFormated = oldValue.replace('.', separator);
  }

  return valueFormated;
}

export const formatFloat = ({ value }) => {
  let oldValue = value == null ? '' : String(value);

  return oldValue.replace(/[^\d,.-]+/g, '').replace(',', '.');
}

export const formatPhone = ({ value }) => {
  let oldValue = !value ? '' : String(onlyNumber(value));
  var valueFormated = oldValue;
  if (oldValue.length > 0 && oldValue.length <= 10) {
    valueFormated = `(${oldValue.substr(0, 2)}) ${oldValue.substr(2, 4)}-${oldValue.substr(6, 4)}`
  } else if (oldValue.length > 0 && oldValue.length === 11) {
    valueFormated = `(${oldValue.substr(0, 2)}) ${oldValue.substr(2, 5)}-${oldValue.substr(7, 4)}`
  }

  return valueFormated
}

export const formatCpfCnpj = ({ value }) => {
  let oldValue = !value ? '' : String(onlyNumber(value));
  var valueFormated = oldValue;
  if (oldValue.length > 11) {
    oldValue = oldValue.substr(0, 14);
    if (oldValue.length >= 13) {
      valueFormated = `${oldValue.substr(0, 2)}.${oldValue.substr(2, 3)}.${oldValue.substr(5, 3)}/${oldValue.substr(8, 4)}-${oldValue.substr(12, 2)}`;
    } else if (oldValue.length >= 9) {
      valueFormated = `${oldValue.substr(0, 2)}.${oldValue.substr(2, 3)}.${oldValue.substr(5, 3)}/${oldValue.substr(8, 4)}`;
    } else if (oldValue.length >= 6) {
      valueFormated = `${oldValue.substr(0, 2)}.${oldValue.substr(2, 3)}.${oldValue.substr(5, 3)}`;
    } else if (oldValue.length >= 3) {
      valueFormated = `${oldValue.substr(0, 2)}.${oldValue.substr(2, 3)}`;
    }
  } else {
    oldValue = oldValue.substr(0, 11);
    if (oldValue.length >= 10) {
      valueFormated = `${oldValue.substr(0, 3)}.${oldValue.substr(3, 3)}.${oldValue.substr(6, 3)}-${oldValue.substr(9, 2)}`;
    } else if (oldValue.length >= 7) {
      valueFormated = `${oldValue.substr(0, 3)}.${oldValue.substr(3, 3)}.${oldValue.substr(6, 3)}`;
    } else if (oldValue.length >= 4) {
      valueFormated = `${oldValue.substr(0, 3)}.${oldValue.substr(3, 3)}`;
    }
  }

  return valueFormated;
}

export const formatPlate = ({ value }) => {
  let oldValue = !value ? '' : String(value.replace(/[^\da-zA-Z]+/g, ''));
  let valueFormated = oldValue;
  oldValue = oldValue.substr(0, 7);
  if (oldValue.length >= 4) {
    valueFormated = `${oldValue.substr(0, 3)}-${oldValue.substr(3, 4)}`;
  }

  return valueFormated.toUpperCase();
}

//Abacate
export const isCpf = value => {
    // Elimina possivel mascara
    value = onlyNumber(value);
    value = value.padStart(11, '0');

    // Verifica se o numero de digitos informados é igual a 11
    if (value.length != 11) {
        return false;
    }
    // Verifica se nenhuma das sequências invalidas abaixo
    // foi digitada. Caso afirmativo, retorna falso
    else if (value == '00000000000' ||
        value == '11111111111' ||
        value == '22222222222' ||
        value == '33333333333' ||
        value == '44444444444' ||
        value == '55555555555' ||
        value == '66666666666' ||
        value == '77777777777' ||
        value == '88888888888' ||
        value == '99999999999') {
        return false;
    // Calcula os digitos verificadores para verificar se o
    // CPF é válido
    } else {

        for (let t = 9; t < 11; t++) {
            let d = 0;
            let c = 0;
            while(c < t) {
                d += value[c] * ((t + 1) - c);
                c++;
            }
            d = ((10 * d) % 11) % 10;
            if (value[c] != d) {
                return false;
            }
        }

        return true;
    }
}

export const isCnpj = value => {
  // Elimina possivel mascara
  value = onlyNumber(value);
  value = value.padStart(14, '0');

  // Verifica se o numero de digitos informados é igual a 11
  if (value.length != 14) {
      return false;
  }

  // Aceita a sequencia 99999999999999 como válida para clientes exterior
  if (value === '99999999999999') {
      return true;
  }

  // Verifica se nenhuma das sequências invalidas abaixo
  // foi digitada. Caso afirmativo, retorna falso
  else if (value == '00000000000000' ||
      value == '11111111111111' ||
      value == '22222222222222' ||
      value == '33333333333333' ||
      value == '44444444444444' ||
      value == '55555555555555' ||
      value == '66666666666666' ||
      value == '77777777777777' ||
      value == '88888888888888') {
      return false;

  // Calcula os digitos verificadores para verificar se o
  // CNPJ é válido
  } else {

      let j = 5;
      let k = 6;
      let soma1 = 0;
      let soma2 = 0;

      for (let i = 0; i < 13; i++) {

          j = j == 1 ? 9 : j;
          k = k == 1 ? 9 : k;

          soma2 += (value[i] * k);

          if (i < 12) {
              soma1 += (value[i] * j);
          }

          k--;
          j--;

      }

      let digito1 = soma1 % 11 < 2 ? 0 : 11 - soma1 % 11;
      let digito2 = soma2 % 11 < 2 ? 0 : 11 - soma2 % 11;

      return ((value[12] == digito1) && (value[13] == digito2));

  }
}

export const isCpfCnpj = value => {
  // Elimina possivel mascara
  value = onlyNumber(value);

  if (value.length === 11) {
    return isCpf(value);
  } else if (value.length === 14) {
    return isCnpj(value);
  }

  return false;
}

export const onlyNumber = value => {
  let oldValue = !value ? '' : String(value);
  return oldValue.replace(/[^\d]+/g, '');
}

export const formatPassword = value => {
  let oldValue = !value ? '' : String(value);
  return oldValue.replace(/[^\da-zA-Z!@#$%&]+/g, '');
}

export const formatDate = ({ value, location = 'Br', format = 'DateHour' }) => {
  if (value === '' || value === null) {
    return ''
  }
  var valueFormated = '';
  if (['Date', 'DateHour'].includes(format)) {
    if (location === 'Br') {
      if (format === 'DateHour') {
        valueFormated = moment(value).format('DD/MM/YYYY HH:mm:ss');
      } else if (format === 'Date') {
        valueFormated = moment(value).format('DD/MM/YYYY');
      }
    } else if ('Date') {
      if (format === 'DateHour') {
        valueFormated = moment(value).format('YYYY-MM-DD HH:mm:ss');
      } else if (format === 'Date') {
        valueFormated = moment(value).format('YYYY-MM-DD');
      }
    }
  } else {
    if (format === 'Hour') {
      valueFormated = moment(value).format('HH:mm');
    } else if (format === 'Day') {
      valueFormated = moment(value).format('DD');
    } else if (format === 'Month') {
      valueFormated = moment(value).format('MM');
    } else if (format === 'Year') {
      valueFormated = moment(value).format('YYYY');
    } else {
      valueFormated = moment(value).locale('pt-br').format(format);
    }
  }

  return valueFormated;
}

export const addDateDays = (date, quantity = 1) => {
  var newDate = new Date(date);
  return newDate.setDate(newDate.getDate() + quantity);
}

export const addDateMonths = (date, quantity = 1) => {
  var newDate = new Date(date);
  return newDate.setMonth(newDate.getMonth() + quantity);
}

export const addDateYears = (date, quantity = 1) => {
  var newDate = new Date(date);
  return newDate.setFullYear(newDate.getFullYear() + quantity);
}

export const removeDateDays = (date, quantity = 1) => {
  var newDate = new Date(date);
  return newDate.setDate(newDate.getDate() - quantity);
}

export const removeDateMonths = (date, quantity = 1) => {
  var newDate = new Date(date);
  return newDate.setMonth(newDate.getMonth() - quantity);
}

export const removeDateYears = (date, quantity = 1) => {
  var newDate = new Date(date);
  return newDate.setFullYear(newDate.getFullYear() - quantity);
}

export const diffDate = ({dateOne, dateTwo, type = 'months', incrementTotal = 0, notNegative = false}) => {
  let now = moment(dateOne);
  let date = moment(dateTwo);

  let diff = 0;
  diff = now.diff(date, type)
  diff += incrementTotal;

  if (notNegative && diff < 0) {
    diff *= -1;
  }

  return diff;
}

export function isMobile() {
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
      return true;
    }
    else {
      return false;
    }
  }

export function multiple (...args) {
  let totMultiple = args.map((value) => {
    let valueCorrect = 0;
    if (!isNaN(parseFloat(String(value).replace(',', '.')))) {
      valueCorrect = parseFloat(String(value).replace(',', '.'));
    }
    return valueCorrect;
  }).reduce((accumulator, currentValue) => accumulator * currentValue)
  totMultiple = (totMultiple*100000000000)/100000000000;
  return totMultiple;
}

export const dateNow = (type = null, format = 'YYYY-MM-DD') => {
  if (type === 'first') {
    return moment().startOf('month').format(format)
  } else if (type === 'last') {
    return moment().endOf('month').format(format)
  }

  return moment().format(format)
}

export const isLeapYear = (year = 0) => {
  let div = year % 4;
  if (div === 0) {
      div = year % 100;
      if (div === 0) {
          div = year % 400;
          if (div === 0) {
              return true;
          }
      } else {
          return true;
      }
  }

  return false;
}

export const Clicksign = (o) => {"use strict";var r,u,t=window.location.protocol+"//"+window.location.host,e={},n=function(t){(e[t]||[]).forEach(function(t){t()})},c=function(t){n(t.data)};return{endpoint:"https://app.clicksign.com",origin:t,mount:function(t){var n="/sign/"+o,e="?embedded=true&origin="+this.origin,i=this.endpoint+n+e;return u=document.getElementById(t),(r=document.createElement("iframe")).setAttribute("src",i),r.setAttribute("style","width: 100%; height: 100%;"),window.addEventListener("message",c),u.appendChild(r)},unmount:function(){return r&&(u.removeChild(r),r=u=null,window.removeEventListener("message",n)),!0},on:function(t,n){return e[t]||(e[t]=[]),e[t].push(n)},trigger:n}}

export const typesImg = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png']
export const typesPdf = ['application/pdf']
export const typesCode = ['text/xml', 'text/html']
export const typesCsv = ['text/csv']
