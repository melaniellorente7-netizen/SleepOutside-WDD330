import { getLocalStorage, setLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const itemIndex = Number(event.currentTarget.dataset.index);
      removeItem(itemIndex);
    });
  });
}

function removeItem(index) {
  const cartItems = getLocalStorage('so-cart') || [];
  const item = cartItems[index];
  if (!item) return;

  const quantity = item.Quantity ?? 1;
  if (quantity > 0) {
    item.Quantity = quantity - 1;
  }
  const remaining = cartItems.filter((i) => (i.Quantity ?? 1) >= 1);
  setLocalStorage('so-cart', remaining);
  renderCartContents();
}

function cartItemTemplate(item, index) {
  const quantity = item.Quantity ?? 1;
  const lineTotal = (item.FinalPrice * quantity).toFixed(2);
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${lineTotal}</p>
  <button type='button' class='delete-btn' data-index='${index}' data-id='${item.Id}' aria-label='Delete ${item.Name}'>x</button>
</li>`;

  return newItem;
}

renderCartContents();
