const categoryTemplate = document.querySelector("#category_template");
const subcategoryTemplate = document.querySelector("#subcategory_template");
const categoriesUrl = `https://kea-alt-del.dk/t7/api/categories`;
const subcategoriesUrl = `https://kea-alt-del.dk/t7/api/subcategories?category=`;

let apiUrl = ``;
// create categories object with subcategories array
let categories = {};


function getKategorier() {
  fetch(categoriesUrl)
  .then((res) => res.json())
  .then((data) => {
    data.forEach((category) => {
      // console.log(category);
      // create categories object with subcategories array
      const safeCategory = category.category.replace(/\s+/g, '-');
      categories[safeCategory] = [];
      const categoryClone = categoryTemplate.content.cloneNode(true);
      categoryClone.querySelector(".category_heading").innerHTML = category.category;
      categoryClone.querySelector(".view_all").href = `produktliste.html?category=${category.category}`;
      categoryClone.querySelector(".category_flex").id = safeCategory;
      document.querySelector("#category_container").appendChild(categoryClone);

      fetch(subcategoriesUrl + category.category)
      .then((res) => res.json())
      .then((subdata) => {
        subdata.forEach((subcategory) => {
          categories[safeCategory].push(subcategory.subcategory);
        });
        console.log(categories);
        addSubcategories();
      });

    });
  });
}

function addSubcategories() {
  for (let category in categories) {
    let categoryDiv = document.querySelector(`#${category}`);
    console.log(categoryDiv)
    categories[category].forEach(subcategory => {
      if (!categoryDiv.querySelector(`a[href="produktliste.html?subcategory=${subcategory}"]`)) {
        const subcategoryClone = subcategoryTemplate.content.cloneNode(true);
        subcategoryClone.querySelector(".subcategory_link").innerHTML = subcategory;
        subcategoryClone.querySelector(".subcategory_link").href = `produktliste.html?subcategory=${subcategory}`;
        categoryDiv.appendChild(subcategoryClone);
      }
    });
  }
}


// function addSubcategories() {
//   for (let category in categories) {
//     console.log(category);
//     let categoryDiv = document.querySelector(`#${category}`);
//     categories[category].forEach((subcategory) => {
//       const subcategoryClone = subcategoryTemplate.content.cloneNode(true);
//       subcategoryClone.querySelector(".subcategory_link").innerHTML = subcategory;
//       subcategoryClone.querySelector(".subcategory_link").href = `produktliste.html?subcategory=${subcategory}`;
//       categoryDiv.appendChild(subcategoryClone);
//     });
//   }
// }












const productCardTemplate = document.querySelector("#product_card_template");
const productGrid = document.querySelector("#product_grid");

const productsUrl = `https://kea-alt-del.dk/t7/api/products?limit=50`;

function getProduktliste() {
    fetch(productsUrl)
    .then((res) => res.json())
    .then((data) => {
        data.forEach((product) => {
            console.log(product);
            const productClone = productCardTemplate.content.cloneNode(true);
            productClone.querySelector(".product_img").src = `https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp`;
            productClone.querySelector(".product_name").textContent = product.productdisplayname;
            productClone.querySelector(".product_price").textContent = product.price;
            productGrid.appendChild(productClone);
        });
    });
}












let id = 12538;
let productIdUrl = `https://kea-alt-del.dk/t7/api/products/${id}`;

function getProduct() {
  fetch(productIdUrl)
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