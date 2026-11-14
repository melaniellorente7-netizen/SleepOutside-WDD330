import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      throw new Error(`Product '${this.productId}' was not found.`);
    }

    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    const existing = cartItems.find((item) => item.Id === this.product.Id);
    
    if (existing) {
      existing.Quantity = (existing.Quantity ?? 1) + 1;
    } else {
      cartItems.push({ ...this.product, Quantity: 1 });
    }
    setLocalStorage('so-cart', cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector('.product-detail h2').textContent = product.Brand.Name;
  document.querySelector('.product-detail h3').textContent =
    product.NameWithoutBrand;

  const productImage = document.getElementById('productImage');
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.Name;

  document.getElementById('productPrice').textContent =
    `$${product.FinalPrice.toFixed(2)}`;
  document.getElementById('productColor').textContent =
    product.Colors[0]?.ColorName ?? '';
  document.getElementById('productDesc').innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById('addToCart').dataset.id = product.Id;
}