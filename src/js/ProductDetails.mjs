import { getLocalStorage, setLocalStorage, setClick } from './utils.mjs';

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
    setClick('#addToCart', () => this.addProductToCart());
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') ?? [];
    setLocalStorage('so-cart', [...cartItems, this.product]);
  }

  renderProductDetails() {
    const { product } = this;
    document.querySelector('.product-detail h3').textContent = product.Brand.Name;
    document.querySelector('.product-detail h2').textContent = product.NameWithoutBrand;

    const img = document.getElementById('productImage');
    img.src = product.Image;
    img.alt = product.Name;

    document.getElementById('productPrice').textContent = `$${product.FinalPrice.toFixed(2)}`;
    document.getElementById('productColor').textContent = product.Colors[0]?.ColorName ?? '';
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
    document.getElementById('addToCart').dataset.id = product.Id;
  }
}
