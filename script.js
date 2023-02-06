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


const articleTypeTemplate = document.querySelector("#article_type_template");
const articleTypeContainer = document.querySelector("#article_type_container");

const brandsUrl = "https://kea-alt-del.dk/t7/api/brands";
const brandContainer = document.querySelector(".brand_container");
const brandTemplate = document.querySelector("#brand_template");

let currentOpenUrl = window.location.href;
let startIndex = 0;

let itemsPerPage = 50;

let id;

// kategori.html

function getCategories() {
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


// produktliste.html

function displayProducts () {
  console.log(productsUrl)
  fetch(productsUrl)
  .then((res) => res.json())
  .then((data) => {
      let items = data.slice(startIndex, startIndex + itemsPerPage);
  // for each product ...
      items.forEach((product) => {
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


function getProductsBySubcategory() {
  
  // get the category name from the url
  let subcategoryUrl = currentOpenUrl.split("=")[1];
  // change productsUrl to include the subcategory
  productsUrl = `https://kea-alt-del.dk/t7/api/products?subcategory=${subcategoryUrl}&limit=1000`;
  // replace category heading with subcategory name and replace dashes with spaces
  document.querySelector(".category_name").textContent = subcategoryUrl.replace(/%20/g, " "); 
  // fetch article types for the subcategory and display them in category_flex div
  articletypeUrl = `https://kea-alt-del.dk/t7/api/articletypes?subcategory=${subcategoryUrl}`;
  fetch(articletypeUrl)
  .then((res) => res.json())
  .then((data) => {
    // for each articletype ...
    data.forEach((articletype) => {
      // replace spaces in articletype name with %20 in order to compare with subcategoryUrl
      articletype.articletype = articletype.articletype.replace(/ /g, "%20");
      // if articletype is not the same as the subcategory ...
      if (articletype.articletype != subcategoryUrl) {
        // replace %20 with spaces in articletype name
        articletype.articletype = articletype.articletype.replace(/%20/g, " ");
        console.log(articletype.articletype)
        const articletypeClone = articleTypeTemplate.content.cloneNode(true);
        // add the articletype name and link to the articletype link div
        articletypeClone.querySelector(".article_type_link").innerHTML = articletype.articletype;
        articletypeClone.querySelector(".article_type_link").href = `produktliste.html?articletype=${articletype.articletype}`;
        // append the articletype to the category_flex div
        articleTypeContainer.appendChild(articletypeClone);
      }
    });
  });
  // fetch and display products
  displayProducts();
  
}

function getProductsByBrand () {
  // get the brand name from the url
  let brandUrl = currentOpenUrl.split("=")[1];
  // change productsUrl to include the brand
  productsUrl = `https://kea-alt-del.dk/t7/api/products?brandname=${brandUrl}&limit=1000`;
  // replace category heading with brand name and replace dashes with spaces
  document.querySelector(".category_name").textContent = brandUrl.replace(/%20/g, " "); 
    // fetch and display products
  displayProducts();
 }

function getProductsByArticletype () {
  // get the articletype name from the url
  let articletypeUrl = currentOpenUrl.split("=")[1];
  console.log(articletypeUrl)
  // change productsUrl to include the articletype
  productsUrl = `https://kea-alt-del.dk/t7/api/products?articletype=${articletypeUrl}&limit=1000`;
  // replace category heading with articletype name and replace dashes with spaces
  document.querySelector(".category_name").textContent = articletypeUrl.replace(/%20/g, " ");
  // fetch and display products
  displayProducts();
}

function getProductsByCategory () {
  let categoryUrl = currentOpenUrl.split("=")[1];
  productsUrl = `https://kea-alt-del.dk/t7/api/products?category=${categoryUrl}&limit=1000`;
  document.querySelector(".category_name").textContent = categoryUrl.replace(/%20/g, " ");
  displayProducts();
}


function getProductsBySeason () {
  let seasonUrl = currentOpenUrl.split("=")[1];
  productsUrl = `https://kea-alt-del.dk/t7/api/products?season=${seasonUrl}&limit=1000`;
  document.querySelector(".category_name").textContent = seasonUrl.replace(/%20/g, " ");
  displayProducts();
}


// brands.html

function getBrands() {
  // fetch brands
  fetch(brandsUrl)
  .then((res) => res.json())
  .then((data) => {
  data.sort((a, b) => (a.brandname > b.brandname) ? 1 : -1);
    // for each brand ...
    data.forEach((brand) => {
      console.log(brand)
      // clone the brand template
      const brandClone = brandTemplate.content.cloneNode(true);
      // add the brand name and link to the brand link div
      brandClone.querySelector(".brand_link").textContent = brand.brandname;
      brandClone.querySelector(".brand_link").href = `produktliste.html?brand=${brand.brandname}`;
      // append the brand to the brand container
      brandContainer.appendChild(brandClone);
    });
  });
}





// produkt.html

// get the product id from the url and fetch the product data
function getProduct() {
  
  let productIdUrl;
  // get the product id from the url and split it from the rest of the url
  id = currentOpenUrl.split("=")[1];
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
  document.querySelector(".brand_name").href = `produktliste.html?brand=${product.brandname}`;
  document.querySelector(".breadcrumb_category").textContent = product.subcategory;
  document.querySelector(".breadcrumb_category").href = `produktliste.html?subcategory=${product.subcategory}`;
  document.querySelector(".breadcrumb_articletype").textContent = product.articletype;
  document.querySelector(".breadcrumb_articletype").href = `produktliste.html?articletype=${product.articletype}`;
  if(product.discount) {
    document.querySelector(".product_buy").classList.add("deal");
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
  if(currentOpenUrl.includes("?subcategory=")) {
  document.getElementById("next").addEventListener("click", function () {
    startIndex += itemsPerPage;
    getProductsBySubcategory();
  });
  getProductsBySubcategory();
  }

  else if(currentOpenUrl.includes("brand=")) {
  document.getElementById("next").addEventListener("click", function () {
    startIndex += itemsPerPage;
    getProductsByBrand();
  });
  getProductsByBrand();
  }

  else if(currentOpenUrl.includes("articletype=")) {
  document.getElementById("next").addEventListener("click", function () {
    startIndex += itemsPerPage;
    getProductsByArticletype();
  });
  getProductsByArticletype();
  }

  else if(currentOpenUrl.includes("?category=")) {
  document.getElementById("next").addEventListener("click", function () {
    startIndex += itemsPerPage;
    getProductsByCategory();
  });
  getProductsByCategory();
  }

  else if(currentOpenUrl.includes("?season=")) {
  document.getElementById("next").addEventListener("click", function () {
    startIndex += itemsPerPage;
    getProductsBySeason();
  });
  getProductsBySeason();
  }

  else if(currentOpenUrl.includes("kategori.html")) {
    getCategories();
  }

  else if(currentOpenUrl.includes("produkt.html")) {
    getProduct();
  }

  else if(currentOpenUrl.includes("brands.html")) {
    getBrands();
  }

}