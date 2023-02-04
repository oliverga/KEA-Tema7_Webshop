const categoriesUrl = `https://kea-alt-del.dk/t7/api/categories`;
const subcategoriesUrl = `https://kea-alt-del.dk/t7/api/subcategories?category=`;
let categories = {};

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
      categories[safeCategory] = [];

      // CLONE TEMPLATE AND ADD TO DOM HERE   

      // fetch subcategories for each category
      fetch(subcategoriesUrl + category.category)
      .then((res) => res.json())
      .then((subdata) => {
        // for each subcategory ...
        subdata.forEach((subcategory) => {
          // add the subcategory to the array for the category
          categories[safeCategory].push(subcategory.subcategory);
        });
        // addSubcategories() is called after all subcategories have been fetched in each category
        addSubcategories();
      });
    });
  });
}

function addSubcategories() {
  // for each category in the categories object ...
  for (let category in categories) {
    // select the category div based on the id
    let categoryDiv = document.querySelector(`#${category}`);
    // for each subcategory in the array for the category ...
    categories[category].forEach(subcategory => {
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
}
