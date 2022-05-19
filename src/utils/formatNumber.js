export function handleFormatNumber(number) {
    const price = Math.floor(number / 100);
    let cents = number % 100;
    cents = cents < 10 ? String(cents).padStart(2, '0') : cents;
    return price + ',' + cents;
}