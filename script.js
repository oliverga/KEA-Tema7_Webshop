let id = 12872;
const url = `https://kea-alt-del.dk/t7/api/products/${id}`;

function getProduct() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => showProduct(data))
    .then((data) => splitLines(data))
}

function showProduct(product) {
  console.log(product)
  document.querySelector(".product_name").textContent = product.productdisplayname;
  document.querySelector(".product_price").textContent = product.price;
  document.querySelector(".product_img").src = `https://kea-alt-del.dk/t7/images/webp/640/${id}.webp`;
  document.querySelector(".product_img").alt = product.productdisplayname;
  document.querySelector(".brand_name").textContent = product.brandname;
  document.querySelector(".breadcrumb_category").textContent = product.articletype;
  return product;
}

function splitLines(product) {
  const paragraph = product.description;
  const split = paragraph.split("<br />");

  split.forEach((line) => {
    const p = document.createElement("p");
    p.innerHTML = line;
    document.querySelector(".product_description").appendChild(p);
    }
  );
}

getProduct();