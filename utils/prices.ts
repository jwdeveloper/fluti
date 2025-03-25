export function nettoToBrutto(netto: number) {
    let value = netto * (1 + 23 / 100)
    return parseFloat(value.toFixed(2));

}