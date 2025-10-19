export const formatCurrency = (value: number, locale = 'es-CO', currency = 'COP') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

export const formatDate = (value?: string) =>
  value ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(value)) : '-';
