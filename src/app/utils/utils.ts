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

export function formatCLP(value: unknown): string {
  const num = Number(value ?? 0);
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(num);
}

/** Normaliza "DDMMAAAA" (string/number) -> "DD/MM/YYYY" */
export function formatFecha8(value: unknown): string | null {
  if (value == null || value === '') return null;
  const raw = String(value).replace(/\D/g, '');
  const padded = raw.padStart(8, '0'); // ej: 3012025 -> 03012025
  if (padded.length !== 8) return raw;
  const dd = padded.slice(0, 2);
  const mm = padded.slice(2, 4);
  const yyyy = padded.slice(4, 8);
  return `${dd}/${mm}/${yyyy}`;
}

/** Acepta "DD/MM/YYYY" tal cual; si viene en 8 dígitos, la normaliza */
export function formatFechaAny(value: unknown): string | null {
  if (value == null || value === '') return null;
  const s = String(value);
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
  return formatFecha8(s);
}

/** DDMMAA -> DD/MM/YYYY con pivote de siglo (por defecto 50 -> 00..50 = 20xx, 51..99 = 19xx) */
export function formatFecha6(value: unknown, pivot = 50): string | null {
  if (value == null || value === '') return null;
  const raw = String(value).replace(/\D/g, '').padStart(6, '0'); // ej: 250106
  if (raw.length !== 6) return raw;

  const dd = raw.slice(0, 2);
  const mm = raw.slice(2, 4);
  const yy = raw.slice(4, 6);
  const yyNum = Number(yy);
  const yyyy = yyNum <= pivot ? 2000 + yyNum : 1900 + yyNum;

  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Convierte fechas de tipo YYMMDD o YYYYMMDD a "DD/MM/YYYY".
 * Retorna null si el valor es nulo o inválido.
 */
export function formatFechaTbk(value: unknown): string | null {
  if (value == null || value === '') return null;

  const s = String(value).padStart(6, '0'); // asegura mínimo 6 dígitos

  // Caso 8 dígitos → YYYYMMDD
  if (/^\d{8}$/.test(s)) {
    const year = s.substring(0, 4);
    const month = s.substring(4, 6);
    const day = s.substring(6, 8);
    return `${day}/${month}/${year}`;
  }

  // Caso 6 dígitos → YYMMDD
  if (/^\d{6}$/.test(s)) {
    const yy = parseInt(s.substring(0, 2), 10);
    const month = s.substring(2, 4);
    const day = s.substring(4, 6);
    // regla simple: años <50 → 2000+, años >=50 → 1900+
    const year = yy < 50 ? 2000 + yy : 1900 + yy;
    return `${day}/${month}/${year}`;
  }

  return null; // caso inválido
}
