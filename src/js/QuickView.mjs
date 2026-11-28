import { addProductToCart, qs } from './utils.mjs';

export default class QuickView {
  constructor(dialogSelector, dataSource) {
    this.dialog = qs(dialogSelector);
    this.dataSource = dataSource;
    this.product = null;

    this.contentEl = qs('.quick-view-body', this.dialog);
    this.closeBtn = qs('.quick-view-close', this.dialog);
    this.addBtn = qs('.quick-view-add', this.dialog);

    this.closeBtn.addEventListener('click', () => this.close());
    this.addBtn.addEventListener('click', () => this.handleAddToCart());
    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.close();
    });
  }

  async open(productId) {
    this.renderLoading();
    this.dialog.showModal();

    try {
      this.product = await this.dataSource.findProductById(productId);
      this.render(this.product);
    } catch (err) {
      console.error('Quick view error:', err);
      this.renderError();
    }
  }

  close() {
    this.dialog.close();
    this.product = null;
  }

  handleAddToCart() {
    if (!this.product) return;
    addProductToCart(this.product);
    this.close();
  }

  renderLoading() {
    this.contentEl.innerHTML = '<p class="quick-view-status">Loading…</p>';
    this.addBtn.hidden = true;
  }

  renderError() {
    this.contentEl.innerHTML =
      '<p class="quick-view-status">Unable to load product. Please try again.</p>';
    this.addBtn.hidden = true;
  }

  render(product) {
    const image = product.Images?.PrimaryLarge ?? product.Image;
    const color = product.Colors?.[0]?.ColorName ?? '';

    this.contentEl.innerHTML = `
      <img class="quick-view-image" src="${image}" alt="${product.Name}" />
      <div class="quick-view-info">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.NameWithoutBrand ?? product.Name}</h3>
        <p class="quick-view-price">$${product.FinalPrice.toFixed(2)}</p>
        ${color ? `<p class="quick-view-color">Color: ${color}</p>` : ''}
        <div class="quick-view-description">${product.DescriptionHtmlSimple ?? ''}</div>
      </div>
    `;
    this.addBtn.hidden = false;
  }
}
