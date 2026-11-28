import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import QuickView from './QuickView.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');
const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const myList = new ProductList(category, dataSource, listElement);
const quickView = new QuickView('#quick-view-modal', dataSource);

myList.init();

listElement.addEventListener('click', (event) => {
  const button = event.target.closest('.quick-view-btn');
  if (!button) return;
  event.preventDefault();
  quickView.open(button.dataset.id);
});
