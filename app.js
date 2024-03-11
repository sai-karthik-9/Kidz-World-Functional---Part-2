// Add event listener to all add buttons
var addToCartButtons = document.querySelectorAll(".add-button");
addToCartButtons.forEach(function (button) {
  button.addEventListener("click", addToCart);
});

// Add event listener to cart button
var cartButton = document.getElementById("cart-items");
cartButton.addEventListener("click", displayCart);

// Function to handle add button click
function addToCart(event) {
  var bookName = event.target.parentNode.querySelector(".book-name").textContent;
  var price = parseFloat(event.target.parentNode.querySelector(".price").textContent.slice(1));
  
  // Checking if item is already in the cart or not
  var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  var existingItem = cartItems.find(item => item.bookName === bookName);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      bookName: bookName,
      price: price,
      quantity: 1
    });
  }

  // Saving updated cart items to local storage
  sessionStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Update cart items count in the HTML file
  updateCartCount();
}

function updateCartCount() {
  var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
  var cartCountElement = document.getElementById("cart-item");
  
  // Calculating total quantity of items in the cart
  var totalCount = cartItems.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);

  // Updating no of cart items in the HTML
  cartCountElement.textContent = `Cart items (${totalCount})`;
}

// Function to handle "Cart" button click
function displayCart() {
  var cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];

  if (cartItems.length === 0) {
    console.log("Cart is empty.");
  } else {
    cartItems.forEach(function (item) {
      console.log(`Item name: ${item.bookName} - Quantity: ${item.quantity}`);
    });

    // Generate order details string
    var orderDetails = cartItems.map(item => `${item.bookName} - Quantity: ${item.quantity}`).join('\n');
    
    // Calculate and display total price with cents
    var totalCents = cartItems.reduce(function (total, item) {
      return total + item.price * item.quantity * 100;
    }, 0);
    var totalDollars = totalCents / 100; // Convert cents back to dollars
    var dollars = Math.floor(totalDollars);
    var cents = Math.round((totalDollars - dollars) * 100);
    console.log(`The total amount is ${dollars}$ and ${cents} cents`);

    // Append order details to WhatsApp link
    var whatsappLink = `https://api.whatsapp.com/send?phone=+918688737117&text=${encodeURIComponent(`Order Details:\n${orderDetails}\n\nTotal Amount: $${dollars}.${cents}`)}`;
    
    // Open WhatsApp link in a new tab
    window.open(whatsappLink, '_blank');
  }
}

var clearButton = document.getElementById("clear");
clearButton.addEventListener("click", function () {
  sessionStorage.clear();
  console.log("Local storage cleared.");
});
