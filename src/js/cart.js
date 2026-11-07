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
  cartItems.splice(index, 1);
  setLocalStorage('so-cart', cartItems);
  renderCartContents();
}

function cartItemTemplate(item, index) {
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
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button type='button' class='delete-btn' data-index='${index}' data-id='${item.Id}' aria-label='Delete ${item.Name}'>x</button>
</li>`;

  return newItem;
}

renderCartContents();
