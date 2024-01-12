export function formatCurrency(currency: string, amount: number) {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// ToDo: Having points <-> amount conversions here is of good convenience.  However, recommended to consolidate
//  this point calculation to either the frontend or backend rather than both places.  That should avoid unexpected
//  bugs if frontend/backend code goes out of sync with each other.
export function convertPointsToDollarAmount(balance: number) {
  return balance / 10;
}

export function convertDollarAmountToPoints(value: string) : number {
  const amount = Number(value)
  if (isNaN(amount)) {
    return 0
  }
  return amount * 10
}
