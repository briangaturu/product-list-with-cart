
let cart = [];


const menuItems = [
  { id: 'waffle', name: 'Waffle with Berries', category: 'Waffle', price: 6.50 },
  { id: 'creme-brulee', name: 'Vanilla Bean Crème Brûlée', category: 'Crème Brûlée', price: 7.00 },
  { id: 'macaron', name: 'Macaron Mix of Five', category: 'Macaron', price: 8.00 },
  { id: 'tiramisu', name: 'Classic Tiramisu', category: 'Tiramisu', price: 5.50 },
  { id: 'baklava', name: 'Pistachio Baklava', category: 'Baklava', price: 4.00 },
  { id: 'lemon-pie', name: 'Lemon Meringue Pie', category: 'Pie', price: 5.00 },
  { id: 'strawberry-cake', name: 'Strawberry Cake', category: 'Cake', price: 6.50 },
  { id: 'brownie', name: 'Chocolate Brownie', category: 'Brownie', price: 5.00 },
  { id: 'panna-cotta', name: 'Vanilla Panna Cotta', category: 'Panna Cotta', price: 6.50 }
];


document.addEventListener('DOMContentLoaded', function() {
  
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', handleAddToCart);
  });
  const confirmButton = document.querySelector('.confirm-btn');
  if (confirmButton) {
    confirmButton.addEventListener('click', handleConfirmOrder);
  }
  const startNewOrderBtn = document.querySelector('.start-new-order-btn');
  if (startNewOrderBtn) {
    startNewOrderBtn.addEventListener('click', () => {
      resetOrder(); 
      hideModal();
    });
  }

  
  updateCartDisplay();
});


function handleAddToCart(event) {
  const menuItemElement = event.currentTarget.closest('.menu-item');
  const itemName = menuItemElement.querySelector('.menu-item-name').textContent;

  
  const menuItemData = menuItems.find(item => item.name === itemName);

  if (!menuItemData) {
    console.error("Error: Menu item data not found for:", itemName);
    return;
  }

  const existingItem = cart.find(item => item.id === menuItemData.id);

  if (existingItem) {
    
    existingItem.quantity += 1;
  } else {
    
    cart.push({
      id: menuItemData.id,
      name: menuItemData.name,
      price: menuItemData.price,
      quantity: 1
    });
  }

  
  updateMenuItemUI(menuItemElement, existingItem ? existingItem.quantity : 1);
  updateCartDisplay(); 
}
function handleQuantityChange(event) {
  const button = event.currentTarget;
  const isIncrease = button.textContent === '+';
  const menuItemElement = button.closest('.menu-item');

  if (!menuItemElement) {
    console.error("Error: Could not find parent .menu-item for quantity change.");
    return;
  }

  const quantityDisplay = menuItemElement.querySelector('.quantity-display');
  let currentQuantity = parseInt(quantityDisplay.textContent);
  const itemName = menuItemElement.querySelector('.menu-item-name').textContent;

  const menuItemData = menuItems.find(item => item.name === itemName);
  if (!menuItemData) {
      console.error("Error: Menu item data not found for:", itemName);
      return;
  }
  const itemId = menuItemData.id;

  const cartItem = cart.find(item => item.id === itemId);

  if (!cartItem) {
      console.error("Error: Cart item not found for quantity change:", itemName);
      return;
  }

  if (isIncrease) {
    currentQuantity += 1;
    cartItem.quantity = currentQuantity;
  } else {
    currentQuantity = Math.max(0, currentQuantity - 1); 
    if (currentQuantity === 0) {
      
      cart = cart.filter(item => item.id !== itemId);
      updateMenuItemUI(menuItemElement, 0); 
    } else {
      cartItem.quantity = currentQuantity;
    }
  }

  quantityDisplay.textContent = currentQuantity; 
  updateCartDisplay();
}
function handleRemoveFromCart(event) {
  const cartItemElement = event.currentTarget.closest('.cart-item');
  const itemName = cartItemElement.querySelector('.cart-item-name').textContent;

  const menuItemData = menuItems.find(item => item.name === itemName);
  if (!menuItemData) {
      console.error("Error: Menu item data not found for:", itemName);
      return;
  }
  const itemId = menuItemData.id;

  cart = cart.filter(item => item.id !== itemId); 
  
  document.querySelectorAll('.menu-item').forEach(menuItem => {
    const menuItemName = menuItem.querySelector('.menu-item-name').textContent;
    if (menuItemName === itemName) {
      updateMenuItemUI(menuItem, 0); 
    }
  });

  updateCartDisplay(); 
}


function handleConfirmOrder() {
  if (cart.length === 0) {
    showEmptyCartModal(); 
  } else {
    showConfirmationModal([...cart]); 
  }
}
function updateMenuItemUI(menuItemElement, quantity) {
  
  menuItemElement.querySelector('.quantity-control')?.remove();
  menuItemElement.querySelector('.add-to-cart-btn')?.remove();

  if (quantity > 0) {
    
    menuItemElement.classList.add('selected-item');
    const quantityControl = document.createElement('div');
    quantityControl.className = 'quantity-control';
    quantityControl.innerHTML = `
      <button class="quantity-btn">-</button>
      <div class="quantity-display">${quantity}</div>
      <button class="quantity-btn">+</button>
    `;
    
    quantityControl.querySelectorAll('.quantity-btn').forEach(button =>
      button.addEventListener('click', handleQuantityChange)
    );
    menuItemElement.appendChild(quantityControl);
  } else {
    
    menuItemElement.classList.remove('selected-item');
    const addButton = document.createElement('button');
    addButton.className = 'add-to-cart-btn';
    addButton.innerHTML = `
      <img src="/assets/images/icon-add-to-cart.svg" alt="" />
      Add to Cart
    `;
    
    addButton.addEventListener('click', handleAddToCart);
    menuItemElement.appendChild(addButton);
  }
}


function updateCartDisplay() {
  const cartItemsContainer = document.querySelector('.cart-items');
  cartItemsContainer.innerHTML = ''; 
  let totalPrice = 0;
  let totalItemsInCart = 0;

  if (cart.length === 0) {
    
    const emptyCartMessage = document.createElement('p');
    emptyCartMessage.className = 'empty-cart-message';
    emptyCartMessage.textContent = 'Your cart is empty.';
    cartItemsContainer.appendChild(emptyCartMessage);
  } else {
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      totalItemsInCart += item.quantity;

      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-quantity">${item.quantity}× <span class="cart-item-unit-price">$${item.price.toFixed(2)}</span></div>
        </div>
        <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
        <button class="remove-btn">
          <img src="/assets/images/icon-remove-item.svg" alt="Remove item"/>
        </button>
      `;
      
      cartItemElement.querySelector('.remove-btn').addEventListener('click', handleRemoveFromCart);
      cartItemsContainer.appendChild(cartItemElement);
    });
  }

  
  document.querySelector('.cart-total span:last-child').textContent = `$${totalPrice.toFixed(2)}`;
  document.querySelector('.cart-count').textContent = totalItemsInCart;
}


function showConfirmationModal(confirmedCartItems) {
  const modal = document.getElementById('confirmation-modal');
  const modalTitle = modal.querySelector('#modal-title');
  const modalOrderSummary = modal.querySelector('#modal-order-summary');
  const modalTotalPriceElement = modal.querySelector('#modal-total-price');
  const confirmMessage = modal.querySelector('.confirmation-message');
  const startNewOrderBtn = modal.querySelector('.start-new-order-btn');

  modalTitle.textContent = "Order Confirmed!";
  confirmMessage.textContent = "Your desserts will be prepared shortly.";
  startNewOrderBtn.textContent = "Start New Order";
  

  modalOrderSummary.innerHTML = ''; 

  let modalTotal = 0;
  confirmedCartItems.forEach(item => {
    const itemTotal = item.price * item.quantity;
    modalTotal += itemTotal;

    const modalItemElement = document.createElement('div');
    modalItemElement.className = 'modal-cart-item';
    modalItemElement.innerHTML = `
      <div class="modal-item-info">
        <div class="modal-item-name">${item.name}</div>
        <div class="modal-item-quantity">${item.quantity}× <span class="modal-item-unit-price">$${item.price.toFixed(2)}</span></div>
      </div>
      <div class="modal-item-price">$${itemTotal.toFixed(2)}</div>
    `;
    modalOrderSummary.appendChild(modalItemElement);
  });
  modalTotalPriceElement.textContent = `$${modalTotal.toFixed(2)}`;

  modal.classList.remove('hidden'); 
  modal.focus(); 
}


function showEmptyCartModal() {
  const modal = document.getElementById('confirmation-modal');
  const modalTitle = modal.querySelector('#modal-title');
  const modalOrderSummary = modal.querySelector('#modal-order-summary');
  const modalTotalPriceElement = modal.querySelector('#modal-total-price');
  const confirmMessage = modal.querySelector('.confirmation-message');
  const startNewOrderBtn = modal.querySelector('.start-new-order-btn');

  modalTitle.textContent = "Your Cart is Empty!";
  confirmMessage.textContent = "Please add some delicious desserts before confirming your order.";
  modalOrderSummary.innerHTML = ''; 
  modalTotalPriceElement.textContent = '$0.00'; 
  startNewOrderBtn.textContent = "Continue Shopping";
  

  modal.classList.remove('hidden');
  modal.focus();
}


function hideModal() {
  const modal = document.getElementById('confirmation-modal');
  modal.classList.add('hidden');
}

function resetOrder() {
  cart = []; 
  
  document.querySelectorAll('.menu-item').forEach(menuItem => updateMenuItemUI(menuItem, 0));
  updateCartDisplay(); 
}


function generateId(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}