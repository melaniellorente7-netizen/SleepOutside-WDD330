import { getLocalStorage, renderListWithTemplate } from './utils.mjs';

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
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
</li>`;
}

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') ?? [];
  const parent = document.querySelector('.product-list');
  renderListWithTemplate(cartItemTemplate, parent, cartItems, 'afterbegin', true);
}

renderCartContents();
