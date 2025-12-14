import { getDynamicMenu } from "./menu";
import type { CartItem, Theme } from "./types";

document.addEventListener("DOMContentLoaded", () => {
  const body: HTMLElement = document.body;
  const themeToggle: HTMLElement | null =
    document.getElementById("theme-toggle");
  const dynamicText: HTMLElement | null =
    document.getElementById("dynamic-menu");
  const addToCartButtons: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(".add-to-cart");
  const tableBody: HTMLTableSectionElement | null =
    document.querySelector("tbody");
  const yourPlateLink: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll(".your-plate-link");

  const copyright: HTMLElement | null = document.getElementById("copyright");
  if (copyright) {
    copyright.textContent = new Date().getFullYear().toString();
  }

  // theme light and dark apply by adding class
  const setTheme = (theme: Theme): void => {
    body.setAttribute("data-bs-theme", theme);
    body.classList.toggle("lightModeOn", theme === "light");
  };

  const savedTheme: string = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme as Theme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-bs-theme");
      const newTheme: Theme = currentTheme === "light" ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  } else {
    console.warn("theme toggle button not found!");
  }

  getDynamicMenu(dynamicText);

  // Check every minute
  setInterval(() => {
    if (dynamicText) {
      getDynamicMenu(dynamicText);
    }
  }, 60 * 1000);

  let displayYourOrderLink: string | null =
    sessionStorage.getItem("yourOrderLink");
  if (displayYourOrderLink) {
    yourPlateLink.forEach(
      (link: HTMLElement) => (link.style.display = "block")
    );
  }

  let existingCartItems = JSON.parse(
    sessionStorage.getItem("cartItems") || "[]"
  );
  if (existingCartItems) {
    (Object.values(existingCartItems) as CartItem[]).forEach(
      (item: CartItem, index) => {
        if (item.quantity > 0) {
          addToCartButtons.forEach((button: HTMLButtonElement) => {
            if (button.getAttribute("data-item") == item.name) {
              button.textContent = `Added`;
              button.style.backgroundColor = `#1f592c`;
              button.disabled = true;
              button.title = `Item already in cart`;
            }
          });
        }
      }
    );
  }

  addToCartButtons.forEach((button: HTMLButtonElement) => {
    button.addEventListener("click", () => {
      const itemName = button.getAttribute("data-item");
      const price = parseFloat(button.getAttribute("data-price") || "0");

      if (itemName && !isNaN(price)) {
        const itemId = itemName.replace(/\s+/g, "-").toLowerCase(); // Unique ID

        let quantityToAdd = 1;
        button.textContent = `Added `;
        button.style.backgroundColor = `#1f592c`;
        button.disabled = true;
        button.title = `Item already in cart`;
        sessionStorage.setItem("yourOrderLink", "true");

        // Get existing cart or start with empty
        let cart: Record<string, CartItem> = JSON.parse(
          sessionStorage.getItem("cartItems") || "{}"
        );

        // You can update or overwrite the cart
        if (cart[itemName]) {
          cart[itemName].quantity += quantityToAdd;
          cart[itemName].total = cart[itemName].quantity * price;
        } else {
          cart[itemName] = {
            name: itemName,
            quantity: quantityToAdd,
            price: price,
            total: price * quantityToAdd,
          };
        }

        // Save back to sessionStorage
        sessionStorage.setItem("cartItems", JSON.stringify(cart));

        // updateTableRow(cart[itemName], itemId);
      }
    });
  });

  // function updateTableRow(item: CartItem, itemId: string): void {
  //   let existingRow = document.querySelector<HTMLTableRowElement>(
  //     `tr[data-id="${itemId}"]`
  //   );

  //   if (existingRow) {
  //     // Update quantity and total only
  //     const quantityCell = existingRow.querySelector(".cart-quantity");
  //     const totalCell = existingRow.querySelector(".cart-total");

  //     if (quantityCell) {
  //       quantityCell.textContent = item.quantity.toString();
  //     }

  //     if (totalCell) {
  //       totalCell.textContent = item.total.toFixed(2);
  //     }

  //   } else {
  //     if (!tableBody) {
  //       console.warn("tableBody not found in DOM.");
  //       return;
  //     }

  //     // Create a new row
  //     const newRow = document.createElement("tr");
  //     newRow.setAttribute("data-id", itemId);

  //     newRow.innerHTML = `
  //     <th scope="row">${tableBody.children.length + 1}</th>
  //     <td>${item.name}</td>
  //     <td class="cart-price">${item.price.toFixed(2)}</td>
  //     <td class="cart-quantity-buttons">
  //       <button class="cart-decrease" data-id="${itemId}">−</button>
  //       <span class="cart-quantity">${item.quantity}</span>
  //       <button class="cart-increase" data-id="${itemId}">+</button>
  //     </td>
  //     <td class="cart-total">${item.total.toFixed(2)}</td>
  //   `;
  //     tableBody.appendChild(newRow);

  //     addQuantityButtonListeners(itemId); // Attach listeners to new row buttons
  //   }
  // }

  // function addQuantityButtonListeners(itemId:string) {
  //   const increaseBtn = document.querySelector(
  //     `.cart-increase[data-id="${itemId}"]`
  //   );
  //   const decreaseBtn = document.querySelector(
  //     `.cart-decrease[data-id="${itemId}"]`
  //   );

  //   increaseBtn?.addEventListener("click", () => updateQuantity(itemId, 1));
  //   decreaseBtn?.addEventListener("click", () => updateQuantity(itemId, -1));
  // }

  // function updateQuantity(itemId:string, change:number):void {
  //   let cart:Record<string, CartItem> = JSON.parse(sessionStorage.getItem("cartItems") || "{}");

  //   let itemName = Object.keys(cart).find(
  //     (name) => name.replace(/\s+/g, "-").toLowerCase() === itemId
  //   );

  //   if (!itemName) return;

  //   let item = cart[itemName];
  //   if (!item) return;
  //   item.quantity += change;

  //   if (item.quantity <= 0) {
  //     delete cart[itemName];
  //     const row = document.querySelector(`tr[data-id="${itemId}"]`);

  //     row?.remove();
  //   } else {
  //     item.total = item.price * item.quantity;
  //     sessionStorage.setItem("cartItems", JSON.stringify(cart));
  //     updateTableRow(item, itemId);
  //   }

  //   sessionStorage.setItem("cartItems", JSON.stringify(cart));
  // }

  // Function to check which element is in the viewport
  function checkActiveLink() {
    const links = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
    const sections = document.querySelectorAll<HTMLElement>("section[id]"); // All sections with IDs

    let currentActive: string | null = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        // If the section is in the viewport
        currentActive = section.id;
      }
    });

    // Remove active class from all links
    links.forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to the link corresponding to the visible section
    if (currentActive) {
      const activeLink = document.querySelector<HTMLAnchorElement>(
        `.nav-link[href="#${currentActive}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  }

  // Check on scroll and on page load

  let ticking: boolean = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });
  window.addEventListener("load", checkActiveLink);
});
