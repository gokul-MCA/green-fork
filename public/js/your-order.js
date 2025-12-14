const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const tableBody = document.querySelector("tbody");
if (!tableBody)
    throw new Error("Table body element not found");
const orderNowButton = document.querySelector(".order-now");
let quantityToAdd = 1;
// Get existing cart or start with empty
let cart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
// const orderPlaced = () => {
orderNowButton?.addEventListener("click", () => {
    console.log(cart);
});
// };
// Create a new row
if (cart) {
    Object.values(cart).forEach((item, index) => {
        const newRow = document.createElement("tr");
        const itemId = item.name.replace(/\s+/g, "-").toLowerCase();
        newRow.setAttribute("data-id", itemId);
        newRow.innerHTML = `
    <th scope="row">${index + 1}</th>
    <td>${item.name}</td>
    <td class="cart-price">${item.price.toFixed(2)}</td>
    <td class="cart-quantity-buttons">
    <button class="cart-decrease" data-id="${itemId}" >−</button>
    <span class="cart-quantity">${item.quantity}</span>
    <button class="cart-increase" data-id="${itemId}" >+</button>
    </td>
    <td class="cart-total">${item.total.toFixed(2)}</td>
    `;
        tableBody.appendChild(newRow);
        // Add event listeners for increase and decrease buttons
        newRow
            .querySelector(".cart-decrease")
            ?.addEventListener("click", () => updateQuantity(itemId, -1));
        newRow
            .querySelector(".cart-increase")
            ?.addEventListener("click", () => updateQuantity(itemId, 1));
    });
}
function updateQuantity(itemId, change) {
    // let cart = JSON.parse(sessionStorage.getItem("cartItems") || "[]");
    let itemName = Object.keys(cart).find((name) => name.replace(/\s+/g, "-").toLowerCase() === itemId);
    if (!itemName)
        return;
    let item = cart[itemName];
    item.quantity += change;
    // If quantity is 0 or less, remove item
    if (item.quantity <= 0) {
        // Remove item from cart
        delete cart[itemName];
        sessionStorage.setItem("cartItems", JSON.stringify(cart));
        // Remove the row from the DOM
        const row = document.querySelector(`tr[data-id="${itemId}"]`);
        if (row)
            row.remove();
    }
    else {
        // Update total price
        item.total = item.price * item.quantity;
        sessionStorage.setItem("cartItems", JSON.stringify(cart));
        // Update the table row
        updateTableRow(item, itemId);
    }
}
function updateTableRow(item, itemId) {
    const row = document.querySelector(`tr[data-id="${itemId}"]`);
    if (!row)
        return;
    const quantityEl = row.querySelector(".cart-quantity");
    const totalEl = row.querySelector(".cart-total");
    if (quantityEl) {
        quantityEl.textContent = item.quantity.toString();
    }
    if (totalEl) {
        totalEl.textContent = item.total.toFixed(2);
    }
}
//  theme light and dark apply by adding class lightModeOn
const setTheme = (theme) => {
    body.setAttribute("data-bs-theme", theme);
    body.classList.toggle("lightModeOn", theme === "light");
};
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-bs-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
}
else {
    console.warn("theme toggle button not found!");
}
export {};
//# sourceMappingURL=your-order.js.map