import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const image = product.Images?.PrimaryMedium ?? product.Image;
  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${image}" alt="${product.Name}">
      <h2>${product.Brand.Name}</h2>
      <h3>${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

function formatCategoryTitle(category) {
  if (!category) return '';
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderTitle();
    this.renderList(list);
  }

  renderTitle() {
    const titleElement = document.querySelector('.products h2');
    if (titleElement) {
      titleElement.textContent = `Top Products: ${formatCategoryTitle(this.category)}`;
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
