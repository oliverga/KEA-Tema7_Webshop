const id = 1651;
const url = `https://kea-alt-del.dk/t7/api/products/${id}`;

function getProduct() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => showProduct(data));
}

function showProduct(product) {
document.querySelector(".product_name").textContent = product.productdisplayname;
document.querySelector(".product_price").textContent = product.price;
document.querySelector(".product_image").src = `https://kea-alt-del.dk/t7/images/webp/640/${id}.webp`;
document.querySelector(".product_image").alt = product.productdisplayname;
document.querySelector(".product_description").innerHTML = product.description;
console.log(product)
}

getProduct();