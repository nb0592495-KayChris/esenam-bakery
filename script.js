// ─── DATA ───
const items = [
  {
    title: "CHOCOLATE FLAVOR",
    desc: "Indulge in the delightful",
    img: "Cupcake-Chocolate.png",
    price: 12.50,
    ingredients: [
      { name: "Blueberries", img: "" },
      { name: "Peach", img: "" },
      { name: "Honey", img: "" },
      { name: "Pancakes", img: "" }
    ],
    bg: "#906750"
  },
  {
    title: "BANNANA FLAVOR",
    desc: "Start your day right",
    img: "Cupcake-Bannana.png",
    price: 8.50,
    ingredients: [
      { name: "Butter", img: "" },
      { name: "Flour", img: "" },
      { name: "Eggs", img: "" }
    ],
    bg: "#f5d76e"
  },
  {
    title: "STRAWBERRY FLAVOR",
    desc: "Fresh and sweet",
    img: "Cupcake-Strawberry.png",
    price: 10.00,
    ingredients: [
      { name: "Strawberries", img: "" },
      { name: "Cream", img: "" },
      { name: "Sugar", img: "" }
    ],
    bg: "#f8a1b2"
  },
  
  {
    title: "OREO FLAVOR",
    desc: "A mixed berry delight",
    img: "Cupcake-Oreos.png",
    price: 14.50,
    ingredients: [
      { name: "Mixed Berries", img: "" },
      { name: "Cake Base", img: "" },
      { name: "Cream", img: "" }
    ],
    bg: "#eec3ac"
  }
  
];

let cart = [];
let current = 0;
let selectedItem = null;

// ─── PAGE NAVIGATION ───
window.showPage = function(pageId) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  if (pageId === 'landingPage') {
    document.querySelector('nav').style.display = 'flex';
    document.querySelector('main').style.display = 'flex';
    document.querySelector('.order-btn').style.display = 'flex';
  } else {
    document.querySelector('nav').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    document.querySelector('.order-btn').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
  }
  updateCartCount();
}

// ─── CAROUSEL ───
window.switchItem = function(index) {
  document.body.style.background = items[index].bg;
  document.body.className = items[index].title.split(' ')[0].toLowerCase();
  if (index === current) return;
  const heroImg = document.getElementById('heroImg');
  const direction = index > current ? '100px' : '-100px';

  heroImg.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  heroImg.style.transform = `translateX(-${direction})`;
  heroImg.style.opacity = '0';

  setTimeout(() => {
    document.getElementById('activeTitle').innerText = items[index].title;
    document.getElementById('activeDesc').innerText = items[index].desc;
    document.querySelector('.card-img').src = items[index].img;
    heroImg.src = items[index].img;
    heroImg.style.transition = 'none';
    heroImg.style.transform = `translateX(${direction})`;
    setTimeout(() => {
      heroImg.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      heroImg.style.transform = 'translateX(0)';
      heroImg.style.opacity = '1';
    }, 50);
  }, 300);

  document.querySelectorAll('.menu-item').forEach((el, i) => {
    el.style.background = i === index ? '#ffe0c2' : '#f7f7f7';
  });

  current = index;
}

// Auto rotate
setInterval(() => {
  const next = (current + 1) % items.length;
  window.switchItem(next);
}, 3000);

// ─── INGREDIENTS SHEET ───
window.openIngredients = function(index) {
  selectedItem = items[index];
  document.getElementById('sheetImg').src = selectedItem.img;
  document.getElementById('sheetTitle').innerText = selectedItem.title;
  document.getElementById('sheetPrice').innerText = `$${selectedItem.price.toFixed(2)}`;

  const list = document.getElementById('ingredientsList');
  list.innerHTML = selectedItem.ingredients.map((ing, i) => `
    <div class="ingredient-item">
      <img src="${ing.img}" alt="${ing.name}"/>
      <div>
        <span>${ing.name}</span><br/>
        <small style="color:#aaa;">50g</small>
      </div>
      <div class="qty-controls" style="margin-left:auto; display:flex; align-items:center; gap:10px;">
        <button onclick="changeQty(${i}, -1)" class="qty-btn">−</button>
        <span id="qty-${i}">1</span>
        <button onclick="changeQty(${i}, 1)" class="qty-btn">+</button>
      </div>
    </div>
  `).join('');

  document.getElementById('sheetOverlay').style.display = 'block';
  document.getElementById('ingredientsSheet').classList.add('open');
}

window.closeIngredients = function() {
  document.getElementById('sheetOverlay').style.display = 'none';
  document.getElementById('ingredientsSheet').classList.remove('open');
}

// ─── CART ───
window.addToCart = function() {
  if (!selectedItem) return;
  cart.push(selectedItem);
  closeIngredients();
  updateCartCount();
  showPage('cartPage');
  renderCart();
}

function updateCartCount() {
  document.getElementById('cartCount').innerText = cart.length;
  const c2 = document.getElementById('cartCount2');
  if (c2) c2.innerText = cart.length;
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:40px;">Your cart is empty</p>';
    document.getElementById('cartTotal').innerText = '$0';
    return;
  }

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.title}"/>
      <div>
        <h4>${item.title}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <button onclick="removeFromCart(${i})" style="margin-left:auto; background:#111; color:#fff; border:none; width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:16px;">−</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('cartTotal').innerText = `$${total.toFixed(2)}`;
}

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

window.changeQty = function(index, change) {
  const el = document.getElementById(`qty-${index}`);
  let val = parseInt(el.innerText) + change;
  if (val < 0) val = 0;
  el.innerText = val;
}

window.scrollToSection = function(id) {
  alert(`${id} page coming soon!`);
}

let paymentMethod = 'card';

window.selectPayment = function(el, method) {
  document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  paymentMethod = method;

  document.getElementById('cardFields').style.display = method === 'card' ? 'block' : 'none';
  document.getElementById('cryptoFields').style.display = method === 'crypto' ? 'block' : 'none';
  document.getElementById('cashFields').style.display = method === 'cash' ? 'block' : 'none';
}

window.showPage = function(pageId) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  if (pageId === 'landingPage') {
    document.querySelector('nav').style.display = 'flex';
    document.querySelector('main').style.display = 'flex';
    document.querySelector('.order-btn').style.display = 'flex';
  } else {
    document.querySelector('nav').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    document.querySelector('.order-btn').style.display = 'none';
    document.getElementById(pageId).style.display = 'block';
  }

  if (pageId === 'checkoutPage') renderCheckoutSummary();
  updateCartCount();
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkoutItems');
  container.innerHTML = cart.map(item => `
    <div class="summary-item">
      <span>${item.title}</span>
      <span>$${item.price.toFixed(2)}</span>
    </div>
  `).join('');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('checkoutTotal').innerText = `$${total.toFixed(2)}`;
}

window.placeOrder = function() {
  const name = document.getElementById('fullName').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;

  if (!name || !phone || !address) {
    alert('Please fill in all required fields.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  document.getElementById('successDetails').innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Payment:</strong> ${paymentMethod}</p>
    <p><strong>Total Paid:</strong> $${total.toFixed(2)}</p>
  `;

  showPage('successPage');
  cart = [];
  updateCartCount();
}

const Trandslider = new Swiper('.tranding-slider', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: '3',
  speed: 1000,
  coverflowEffect: {
    rotate: 0,
    stretch: 15,
    depth: 100,
    modifier: 1.5,
    slideShadows: false,
   },
   pagination: {
    el: '.swiper-pagination',
    clickable: true,
   },
   navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
   }
});
