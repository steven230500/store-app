export const formatCOP = (price_in_cents: number) =>
  `$ ${Math.round(price_in_cents / 100).toLocaleString('es-CO')} COP`;
