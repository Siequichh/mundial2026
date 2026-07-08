// Mapa selección → código ISO de flag-icons + nombre corto para el bracket.
const equipos = {
  'México': { iso: 'mx', corto: 'MEX' },
  'Sudáfrica': { iso: 'za', corto: 'RSA' },
  'Corea del Sur': { iso: 'kr', corto: 'KOR' },
  'República Checa': { iso: 'cz', corto: 'CZE' },
  'Suiza': { iso: 'ch', corto: 'SUI' },
  'Canadá': { iso: 'ca', corto: 'CAN' },
  'Bosnia y Herzegovina': { iso: 'ba', corto: 'BIH' },
  'Catar': { iso: 'qa', corto: 'QAT' },
  'Brasil': { iso: 'br', corto: 'BRA' },
  'Marruecos': { iso: 'ma', corto: 'MAR' },
  'Escocia': { iso: 'gb-sct', corto: 'SCO' },
  'Haití': { iso: 'ht', corto: 'HAI' },
  'Estados Unidos': { iso: 'us', corto: 'USA' },
  'Australia': { iso: 'au', corto: 'AUS' },
  'Paraguay': { iso: 'py', corto: 'PAR' },
  'Turquía': { iso: 'tr', corto: 'TUR' },
  'Alemania': { iso: 'de', corto: 'GER' },
  'Costa de Marfil': { iso: 'ci', corto: 'CIV' },
  'Ecuador': { iso: 'ec', corto: 'ECU' },
  'Curazao': { iso: 'cw', corto: 'CUW' },
  'Países Bajos': { iso: 'nl', corto: 'NED' },
  'Japón': { iso: 'jp', corto: 'JPN' },
  'Suecia': { iso: 'se', corto: 'SWE' },
  'Túnez': { iso: 'tn', corto: 'TUN' },
  'Bélgica': { iso: 'be', corto: 'BEL' },
  'Egipto': { iso: 'eg', corto: 'EGY' },
  'Irán': { iso: 'ir', corto: 'IRN' },
  'Nueva Zelanda': { iso: 'nz', corto: 'NZL' },
  'España': { iso: 'es', corto: 'ESP' },
  'Cabo Verde': { iso: 'cv', corto: 'CPV' },
  'Uruguay': { iso: 'uy', corto: 'URU' },
  'Arabia Saudita': { iso: 'sa', corto: 'KSA' },
  'Francia': { iso: 'fr', corto: 'FRA' },
  'Noruega': { iso: 'no', corto: 'NOR' },
  'Senegal': { iso: 'sn', corto: 'SEN' },
  'Irak': { iso: 'iq', corto: 'IRQ' },
  'Argentina': { iso: 'ar', corto: 'ARG' },
  'Austria': { iso: 'at', corto: 'AUT' },
  'Argelia': { iso: 'dz', corto: 'ALG' },
  'Jordania': { iso: 'jo', corto: 'JOR' },
  'Colombia': { iso: 'co', corto: 'COL' },
  'Portugal': { iso: 'pt', corto: 'POR' },
  'R.D. Congo': { iso: 'cd', corto: 'COD' },

  'Uzbekistán': { iso: 'uz', corto: 'UZB' },
  'Inglaterra': { iso: 'gb-eng', corto: 'ENG' },
  'Croacia': { iso: 'hr', corto: 'CRO' },
  'Ghana': { iso: 'gh', corto: 'GHA' },
  'Panamá': { iso: 'pa', corto: 'PAN' },
}

export function flagClass(nombre) {
  const eq = equipos[nombre]
  return eq ? `fi fi-${eq.iso}` : 'fi'
}

export function nombreCorto(nombre) {
  return equipos[nombre]?.corto ?? nombre
}
