

export function getMapMarkerHtml(item: any) : string
{

    let price = item.price + "";

    if (item.price >= 1_000_000) {
        // Format price in millions
        price = (item.price / 1_000_000).toFixed(1) + " mln";
    } else if (item.price >= 1_000) {
        // Format price in thousands
        price = (item.price / 1_000).toFixed(1) + "k";
    }
    return `
    <div>
        <div class="custom-icon">${price} zł<div>
    </div>
    `;
}