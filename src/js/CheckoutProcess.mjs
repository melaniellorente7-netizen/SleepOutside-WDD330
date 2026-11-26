import { getLocalStorage, setLocalStorage, formatPrice, calculateTotalProductPrice, qs } from './utils.mjs';

const TAX_RATE = 0.06;
const FIRST_ITEM_SHIPPING = 10;
const EXTRA_ITEM_SHIPPING = 2;

function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.Quantity ?? 1,
    }));
}

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const payload = {};
    formData.forEach((value, key) => {
        payload[key] = value;
    });
    return payload;
}

export default class CheckoutProcess {
    constructor(key, outputSelectors, externalServices) {
        this.key = key;
        this.outputSelectors = outputSelectors;
        this.externalServices = externalServices;
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.calculateItemSubtotal();
    }

    get list() {
        return getLocalStorage(this.key) || [];
    }

    calculateItemSubtotal() {
        this.itemTotal = calculateTotalProductPrice(this.list);

        const subtotalEl = qs(this.outputSelectors.subtotal);
        if (subtotalEl) subtotalEl.textContent = formatPrice(this.itemTotal);
    }

    calculateOrderTotal() {
        const quantityCount = this.list.reduce(
            (sum, item) => sum + (item.Quantity ?? 1),
            0,
        );

        this.shipping =
            quantityCount > 0
                ? FIRST_ITEM_SHIPPING + (quantityCount - 1) * EXTRA_ITEM_SHIPPING
                : 0;
        this.tax = this.itemTotal * TAX_RATE;
        this.orderTotal = this.itemTotal + this.shipping + this.tax;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const { shipping, tax, orderTotal } = this.outputSelectors;
        const shippingEl = qs(shipping);
        const taxEl = qs(tax);
        const totalEl = qs(orderTotal);

        if (shippingEl) shippingEl.textContent = formatPrice(this.shipping);
        if (taxEl) taxEl.textContent = formatPrice(this.tax);
        if (totalEl) totalEl.textContent = formatPrice(this.orderTotal);
    }

    async checkout(form) {
        const items = this.list;
        this.calculateOrderTotal();

        const order = formDataToJSON(form);
        order.orderDate = new Date().toISOString();
        order.items = packageItems(items);
        order.orderTotal = this.orderTotal.toFixed(2);
        order.shipping = this.shipping;
        order.tax = this.tax.toFixed(2);

        try {
            const response = await this.externalServices.checkout(order);
            setLocalStorage(this.key, []);
            return response;
        } catch (err) {
            console.error('Checkout error:', err);
            throw err;
        }
    }
}
