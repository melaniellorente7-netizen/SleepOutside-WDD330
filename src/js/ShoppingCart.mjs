import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  updateCartCount,
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
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${lineTotal}</p>
  <button type='button' class='delete-btn' data-id='${item.Id}' aria-label='Delete ${item.Name}'>x</button>
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
      const button = event.target.closest('.delete-btn');
      if (!button) return;
      this.removeItem(button.dataset.id);
    });
  }

  getItems() {
    return getLocalStorage(this.key) || [];
  }

  renderCart() {
    const items = this.getItems();
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
    const index = items.findIndex((i) => String(i.Id) === String(id));
    if (index === -1) return;

    const item = items[index];
    const quantity = item.Quantity ?? 1;
    if (quantity > 1) {
      item.Quantity = quantity - 1;
    } else {
      items.splice(index, 1);
    }
    setLocalStorage(this.key, items);
    this.renderCart();
    updateCartCount();
  }
}
