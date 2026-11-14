import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');
const dataSource = new ProductData();
const element = document.querySelector('.product-list'); //find the element where the products will appear. 
const myList = new ProductList(category, dataSource, element); // creates product list. 

myList.init(); // Display products.