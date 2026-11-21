
import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  updateCartCount,
  formatPrice,
  calculateTotalProductPrice
} from './utils.mjs';

function cartItemTemplate(item) {
  const quantity = item.Quantity ?? 1;
  const lineTotal = (item.FinalPrice * quantity).toFixed(2);
  const image = item.Images?.PrimaryMedium ?? item.Image;

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${image}"
        alt="${item.Name}"
      />
    </a>

    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>

    <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ''}</p>

    <div class="cart-card__quantity">
      <button
        type="button"
        class="quantity-btn"
        data-action="decrease"
        data-id="${item.Id}"
      >-</button>

      <span>QTY: ${quantity}</span>

      <button
        type="button"
        class="quantity-btn"
        data-action="increase"
        data-id="${item.Id}"
      >+</button>
    </div>

    <p class="cart-card__price">$${lineTotal}</p>

    <button
      type="button"
      class="delete-btn"
      data-id="${item.Id}"
      aria-label="Delete ${item.Name}"
    >x</button>
  </li>`;
}

export default class ShoppingCart {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  init() {
    this.renderCart();

    this.listElement.addEventListener('click', (event) => {
      const button = event.target.closest('button');

      if (!button) return;

      const id = button.dataset.id;

      if (button.classList.contains('quantity-btn')) {
        const action = button.dataset.action;

        if (action === 'increase') {
          this.changeQuantity(id, 1);
        }

        if (action === 'decrease') {
          this.changeQuantity(id, -1);
        }
      }

      if (button.classList.contains('delete-btn')) {
        this.removeItem(id);
      }
    });
  }

  changeQuantity(id, amount) {
    const items = this.getItems();

    const item = items.find(
      (i) => String(i.Id) === String(id)
    );

    if (!item) return;

    const quantity = item.Quantity ?? 1;
    const newQuantity = quantity + amount;

    if (newQuantity <= 0) {
      this.removeItem(id);
      return;
    }

    item.Quantity = newQuantity;

    setLocalStorage(this.key, items);

    this.renderCart();
    updateCartCount();
  }

  getItems() {
    return getLocalStorage(this.key) || [];
  }

  renderCart() {
    const items = this.getItems();

    const cartFooter = document.querySelector('.cart-footer');

    if (cartFooter) {
      cartFooter.classList.toggle('hide', items.length === 0);
    }

    const total = calculateTotalProductPrice(items);

    const totalElement = document.querySelector('.cart-total');

    if (totalElement) {
      totalElement.textContent = `Total: ${formatPrice(total)}`;
    }

    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      items,
      'afterbegin',
      true,
    );
  }

  removeItem(id) {
    const items = this.getItems();

    const index = items.findIndex(
      (i) => String(i.Id) === String(id)
    );

    if (index === -1) return;

    items.splice(index, 1);

    setLocalStorage(this.key, items);

    this.renderCart();
    updateCartCount();
  }
}
