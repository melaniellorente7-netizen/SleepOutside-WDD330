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
    const response = await checkout.checkout(form);

    if (response === null) return;

    console.log('Order submitted:', response);
    updateCartCount();
    window.location.href = '/checkout/success.html';

  } catch (error) {
    console.error('Checkout failed:', error);
    alert('Something went wrong. Please try again.');
  }
});

/** Enable Mock for quick testing */

function mockForm() {
  const data = {
    fname: 'John',
    lname: 'Doe',
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    cardNumber: '1234123412341234',
    expiration: '12/28',
    code: '123',
  };

  Object.keys(data).forEach((key) => {
    form.elements[key].value = data[key];

    if (key === 'zip') {
      form.elements[key].dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

// mockForm();
