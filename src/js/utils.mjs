// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  template,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = '';
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template ?? '';
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export function updateCartCount() {
  const badge = qs('.cart-count');
  if (!badge) return;

  const items = getLocalStorage('so-cart') || [];
  const total = items.reduce((sum, item) => sum + (item.Quantity ?? 1), 0);

  badge.textContent = total;
  badge.hidden = total === 0;
}

export async function loadHeaderFooter() {
  const [header, footer] = await Promise.all([
    loadTemplate('/partials/header.html'),
    loadTemplate('/partials/footer.html'),
  ]);

  const headerElement = qs('#main-header');
  const footerElement = qs('#main-footer');

  if (headerElement) {
    renderWithTemplate(header, headerElement, null, updateCartCount);
  }
  if (footerElement) {
    renderWithTemplate(footer, footerElement);
  }
}
