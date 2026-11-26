import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess(
  'so-cart',
  {
    subtotal: '#subtotal',
    shipping: '#shipping',
    tax: '#tax',
    orderTotal: '#orderTotal',
  },
  new ExternalServices(),
);
checkout.init();

const form = document.forms.checkout;
const zipInput = form.elements.zip;

zipInput.addEventListener('input', () => {
  if (!zipInput.checkValidity()) return;
  checkout.calculateOrderTotal();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  try {
    await checkout.checkout(form);
    updateCartCount();
    window.location.href = '/checkout/success.html';
  } catch (err) {
    const message = extractErrorMessage(err);
    alert(message);
  }
});

function extractErrorMessage(err) {
  if (!err) return 'Something went wrong. Please try again.';
  const body = err.message;
  if (typeof body === 'string') return body;
  if (body && typeof body === 'object') {
    return Object.values(body).join('\n');
  }
  return 'Something went wrong. Please try again.';
}
