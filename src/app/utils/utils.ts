export function runFormatter(rutValue: string) {
  if (!rutValue) {
    return '';
  }

  const rut = rutValue.toString().replace(/[^\dk-]/gi, '');
  const splitRut = rut.split('-');
  const dv = splitRut[1];
  const numberPart = splitRut[0];
  const formattedRut = numberPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
  return formattedRut;
}

export function moneyFormatter(moneyValue: number, moneyCountry: string = 'CLP') {
  const moneyFormatted = moneyValue.toLocaleString('es-CL', {
    style: 'currency',
    currency: moneyCountry,
  });

  return moneyFormatted;
}

export function clearAccent(cadena: string, toUpper: boolean = false) {
  cadena = toUpper ? cadena.toUpperCase() : cadena;
  return cadena
    .replace(/[á]/gi, 'A')
    .replace(/[é]/gi, 'E')
    .replace(/[í]/gi, 'I')
    .replace(/[ó]/gi, 'O')
    .replace(/[ú]/gi, 'U');
}

export function capitalizeProperNames(inputString: string): string {
  if (typeof inputString !== 'string' || inputString.trim().length === 0) {
    return '';
  }
  inputString = inputString.replace(/_/g, ' ');

  const exceptions = ['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'en', 'a', 'con'];
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  return inputString
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index !== 0 && exceptions.includes(word)) {
        return word;
      } else {
        if (romanNumerals.includes(word.toUpperCase())) {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    })
    .join(' ');
}
