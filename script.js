// declare variables
const categoryTemplate = document.querySelector("#category_template");
const subcategoryTemplate = document.querySelector("#subcategory_template");
const categoriesUrl = `https://kea-alt-del.dk/t7/api/categories`;
const subcategoriesUrl = `https://kea-alt-del.dk/t7/api/subcategories?category=`;
const categoryContainer = document.querySelector("#category_container");
let categoriesObject = {};

const productCardTemplate = document.querySelector("#product_card_template");
const productGrid = document.querySelector("#product_grid");
let productsUrl = `https://kea-alt-del.dk/t7/api/products?limit=50`;
let currentOpenUrl = window.location.href;

let id;

// kategori.html

function getKategorier() {
  // fetch categories
  fetch(categoriesUrl)
  .then((res) => res.json())
  .then((data) => {
    // for each category ...
    data.forEach((category) => {
      // replace spaces with dashes
      const safeCategory = category.category.replace(/\s+/g, '-');
      // create an array for each category and add it to the categories object
      categoriesObject[safeCategory] = [];
      // clone the category template
      const categoryClone = categoryTemplate.content.cloneNode(true);
      // add the category name to the category heading and link to the view all link div
      categoryClone.querySelector(".category_heading").innerHTML = category.category;
      categoryClone.querySelector(".view_all").href = `produktliste.html?category=${category.category}`;
      // give category flex div an id based on the category name
      categoryClone.querySelector(".category_flex").id = safeCategory;
      // append the category stuff to the category container
      categoryContainer.appendChild(categoryClone);
      // fetch subcategories for each category
      fetch(subcategoriesUrl + category.category)
      .then((res) => res.json())
      .then((subdata) => {
        // for each subcategory ...
        subdata.forEach((subcategory) => {
          // add the subcategory to the array for the category
          categoriesObject[safeCategory].push(subcategory.subcategory);
        });
        // for each category in categoriesObject... 
        for (let category in categoriesObject) {
          // select the category div based on the id
          let categoryDiv = document.querySelector(`#${category}`);
          // for each subcategory in the array for the category ...
          categoriesObject[category].forEach(subcategory => {
            // if the subcategory link doesn't already exist ...
            if (!categoryDiv.querySelector(`a[href="produktliste.html?subcategory=${subcategory}"]`)) {
              // clone the subcategory template
              const subcategoryClone = subcategoryTemplate.content.cloneNode(true);
              // add the subcategory name and link to the subcategory link div
              subcategoryClone.querySelector(".subcategory_link").innerHTML = subcategory;
              subcategoryClone.querySelector(".subcategory_link").href = `produktliste.html?subcategory=${subcategory}`;
              // append the subcategory to the category div
              categoryDiv.appendChild(subcategoryClone);
            }
          });
        }
      });
    });
    console.log(categoriesObject)
  });
  
}

// function addSubcategories() {
//   // for each category in the categories object ...
//   for (let category in categoriesObject) {
//     // select the category div based on the id
//     let categoryDiv = document.querySelector(`#${category}`);
//     // for each subcategory in the array for the category ...
//     categoriesObject[category].forEach(subcategory => {
//       // if the subcategory link doesn't already exist ...
//       if (!categoryDiv.querySelector(`a[href="produktliste.html?subcategory=${subcategory}"]`)) {
//         // clone the subcategory template
//         const subcategoryClone = subcategoryTemplate.content.cloneNode(true);
//         // add the subcategory name and link to the subcategory link div
//         subcategoryClone.querySelector(".subcategory_link").innerHTML = subcategory;
//         subcategoryClone.querySelector(".subcategory_link").href = `produktliste.html?subcategory=${subcategory}`;
//         // append the subcategory to the category div
//         categoryDiv.appendChild(subcategoryClone);
//       }
//     });
//   }
// }

// produktliste.html

function getProduktliste() {
  // get the category name from the url
  let subcategoryUrl = currentOpenUrl.split("=")[1];
  // change productsUrl to include the subcategory
  productsUrl = `https://kea-alt-del.dk/t7/api/products?subcategory=${subcategoryUrl}&limit=50`;
  // replace category heading with subcategory name and replace dashes with spaces
  document.querySelector(".category_name").textContent = subcategoryUrl.replace(/%20/g, " "); 
  // fetch products
    fetch(productsUrl)
    .then((res) => res.json())
    .then((data) => {
        // for each product ...
        data.forEach((product) => {
            console.log(product)
            // clone the product card template
            const productClone = productCardTemplate.content.cloneNode(true);
            // add the product image, links, name, and price to the product card
            productClone.querySelector(".product_img").src = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;
            productClone.querySelector(".product_card a").href = `produkt.html?id=${product.id}`;
            productClone.querySelector(".product_name").textContent = product.productdisplayname;
            productClone.querySelector(".product_price").textContent = product.price;
            if(product.discount) {
              productClone.querySelector(".product_card").classList.add("deal");
              productClone.querySelector(".deal_price").textContent = "₹ " + Math.round(product.price - (product.price * (product.discount / 100)));
            }
            if(product.soldout) {
              productClone.querySelector(".product_card").classList.add("sold_out");
              productClone.querySelector(".sold_out_text").textContent = "Sold Out";
            }


            // append the product card to the product grid
            productGrid.appendChild(productClone);
        });
    });
}

// produkt.html

// get the product id from the url and fetch the product data
function getProduct() {
  
  let productIdUrl;

  // get the product id from the url and split it from the rest of the url
  id = window.location.href.split("=")[1];
  // change the productsUrl to include the product id
  productIdUrl = `https://kea-alt-del.dk/t7/api/products/${id}`;
  // fetch the product
  fetch(productIdUrl)
    .then((res) => res.json())
    // show the product
    .then((product) => showProduct(product))
    // split the description lines into multiple paragraphs
    .then((product) => splitLines(product))
}

// show the product on the product page
function showProduct(product) {
  console.log(product)
  // add the product name, price, image, brand name, and category to the product page
  document.querySelector(".product_name").textContent = product.productdisplayname;
  document.querySelector(".product_price").textContent = product.price;
  document.querySelector(".product_img").src = `https://kea-alt-del.dk/t7/images/webp/640/${id}.webp`;
  document.querySelector(".product_img").alt = product.productdisplayname;
  document.querySelector(".brand_name").textContent = product.brandname;
  document.querySelector(".brand_name").href = `brands.html?brandname=${product.brandname}`;
  document.querySelector(".breadcrumb_category").textContent = product.subcategory;
  document.querySelector(".breadcrumb_category").href = `produktliste.html?subcategory=${product.subcategory}`;
  document.querySelector(".breadcrumb_articletype").textContent = product.articletype;
  document.querySelector(".breadcrumb_articletype").href = `produktliste.html?articletype=${product.articletype}`;
  if(product.discount) {
    document.querySelector(".deal_price").textContent = "₹ " + Math.round(product.price - (product.price * (product.discount / 100)));
  }
  if(product.soldout) {
    document.querySelector(".product_buy").classList.add("sold_out");
    document.querySelector(".sold_out_text").textContent = "Sold Out";
  }
  // return the product so that the next function can use it
  return product;
}

// split the description into multiple paragraphs
function splitLines(product) {
  // declare a variable for the product description
  const paragraph = product.description;
  // split the description into an array of lines at the <br /> tags
  const split = paragraph.split("<br />");

  // for each line in the array ...
  split.forEach((line) => {
    // create a new paragraph element
    const p = document.createElement("p");
    // add the line to the paragraph
    p.innerHTML = line;
    // append the paragraph to the product description div
    document.querySelector(".product_description").appendChild(p);
    }
  )
}

// on page load, run the appropriate function based on the url
window.onload = function() {
  if(window.location.href.includes("produktliste.html")) {
      getProduktliste();
  }
  else if(window.location.href.includes("kategori.html")) {
      getKategorier();
  }
  else if(window.location.href.includes("produkt.html")) {
      getProduct();
  }
}