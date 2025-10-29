// === DOM ELEMENTS ===
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section, .hero');
const genderButtons = document.querySelectorAll('.shop-nav button');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navLinks');
const body = document.body;

const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartModal = document.getElementById('cartModal');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

const maleSearch = document.getElementById('maleSearch');
const femaleSearch = document.getElementById('femaleSearch');
const maleFilter = document.getElementById('maleFilter');
const femaleFilter = document.getElementById('femaleFilter');
const maleProductsEl = document.getElementById('maleProducts');
const femaleProductsEl = document.getElementById('femaleProducts');

const itemPopup = document.getElementById('itemPopup');
const popupImg = itemPopup.querySelector('img');
const popupName = itemPopup.querySelector('h3');
const popupDesc = itemPopup.querySelector('p');
const popupPrice = itemPopup.querySelector('span');
const closePopupBtn = itemPopup.querySelector('.close-popup');
const addPopupBtn = itemPopup.querySelector('.add-popup');

const toast = document.getElementById('toast');

let cart = [];
let maleList = [];
let femaleList = [];
let currentPopupItem = null;

// === SECTION SWITCHING ===
function switchSection(targetId) {
  sections.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(targetId);
  if (target) target.classList.add('active');

  navLinks.forEach(a => a.classList.remove('active'));
  const currentLink = document.querySelector(`.nav-links a[data-target="${targetId}"]`);
  if (currentLink) currentLink.classList.add('active');

  navMenu.classList.remove('show');
  hamburger.classList.remove('active');
  body.classList.remove('menu-open', 'blur');
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('data-target');
    if (target) switchSection(target);
  });
});

// === HAMBURGER MENU ===
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('show');
  body.classList.toggle('menu-open');
  body.classList.toggle('blur');
});

// === CART ===
openCartBtn.addEventListener('click', () => cartModal.classList.add('show'));
closeCartBtn.addEventListener('click', () => cartModal.classList.remove('show'));

function updateCartUI() {
  cartItemsEl.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <span>${item.name}</span>
      <label>Pair</label>
      <input type="number" min="1" value="${item.qty || 1}" class="qty-input">
      <label>Colour</label>
      <select class="color-select">
        <option value="Red">Red</option>
        <option value="Blue">Blue</option>
        <option value="Black">Black</option>
        <option value="White">White</option>
      </select>
      <label>Shoe Size</label>
      <select class="size-select">
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
      <span class="item-price">₦${item.price * (item.qty || 1)}</span>
      <button class="remove-btn">Remove</button>
    `;

    const qtyInput = div.querySelector('.qty-input');
    const priceEl = div.querySelector('.item-price');

    qtyInput.addEventListener('change', () => {
      item.qty = parseInt(qtyInput.value) || 1;
      priceEl.textContent = `₦${item.price * item.qty}`;
      updateTotal();
    });

    div.querySelector('.remove-btn').addEventListener('click', () => {
      cart.splice(index, 1);
      updateCartUI();
      toggleCartButton(item.name, false);
    });

    cartItemsEl.appendChild(div);
    total += item.price * (item.qty || 1);
  });

  cartCountEl.textContent = cart.length;
  cartTotalEl.textContent = `Total: ₦${total}`;
}

function updateTotal() {
  let total = 0;
  cart.forEach(item => total += item.price * (item.qty || 1));
  cartTotalEl.textContent = `Total: ₦${total}`;
}

// === SHOP ITEMS ===
maleList = [
  { name: 'Classic Sneakers', price: 40000, img: 'm_shoe1.jpg', desc: 'Stylish and durable sneakers.' },
  { name: 'Formal Leather Shoes', price: 15000, img: 'm_shoe2.jpg', desc: 'Perfect for office or formal events.' },
  { name: 'Running Trainers', price: 25000, img: 'm_shoe3.jpg', desc: 'Comfortable and lightweight trainers.' },
  { name: 'Casual Loafers', price: 60000, img: 'm_shoe4.jpg', desc: 'Casual yet classy for outings.' }
];

femaleList = [
  { name: 'Elegant Heels', price: 65000, img: 'f_shoe4.jpg', desc: 'Elegant and stylish heels for ladies.' },
  { name: 'Casual Flats', price: 20000, img: 'f_shoe3.jpg', desc: 'Perfect for comfort and casual wear.' },
  { name: 'Sport Sneakers', price: 50000, img: 'f_shoe2.jpg', desc: 'Lightweight and sporty.' },
  { name: 'Ankle Boots', price: 80000, img: 'f_shoe1.jpg', desc: 'Durable boots for all occasions.' }
];

// === CREATE PRODUCT CARDS ===
function createProductCard(item) {
  const card = document.createElement('div');
  card.className = 'product';
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <div class="product-content">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <span>₦${item.price}</span>
      <div class="btn-row">
        <button class="view-btn">View</button>
        <button class="add-btn">Add to Cart</button>
      </div>
    </div>
  `;

  const addBtn = card.querySelector('.add-btn');

  addBtn.addEventListener('click', () => {
    const inCart = cart.find(c => c.name === item.name);
    if (inCart) {
      // Remove item
      cart = cart.filter(c => c.name !== item.name);
      addBtn.textContent = 'Add to Cart';
    } else {
      item.qty = 1;
      cart.push(item);
      addBtn.textContent = 'Remove from Cart';
    }
    updateCartUI();
    showToast();
  });

  card.querySelector('.view-btn').addEventListener('click', () => {
    currentPopupItem = item;
    popupImg.src = item.img;
    popupName.textContent = item.name;
    popupDesc.textContent = item.desc;
    popupPrice.textContent = `₦${item.price}`;
    itemPopup.classList.add('show');
  });

  return card;
}

// Toggle "Add/Remove" button text dynamically
function toggleCartButton(name, added) {
  const allBtns = document.querySelectorAll('.add-btn');
  allBtns.forEach(btn => {
    const productName = btn.closest('.product').querySelector('h3').textContent;
    if (productName === name) btn.textContent = added ? 'Remove from Cart' : 'Add to Cart';
  });
}

// === DISPLAY PRODUCTS ===
function displayProducts(list, container) {
  container.innerHTML = '';
  list.forEach(item => container.appendChild(createProductCard(item)));
  setTimeout(() => container.classList.add('show'), 50);
}

displayProducts(maleList, maleProductsEl);
displayProducts(femaleList, femaleProductsEl);

// === MALE/FEMALE TAB SWITCHING ===
genderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    genderButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const gender = btn.getAttribute('data-gender');

    document.getElementById('male').style.display = gender === 'male' ? 'block' : 'none';
    document.getElementById('female').style.display = gender === 'female' ? 'block' : 'none';
  });
});

// === SEARCH ===
function searchProducts(list, query) {
  return list.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
}

maleSearch.addEventListener('input', e => displayProducts(searchProducts(maleList, e.target.value), maleProductsEl));
femaleSearch.addEventListener('input', e => displayProducts(searchProducts(femaleList, e.target.value), femaleProductsEl));

// === FILTER ===
function sortProducts(list, type) {
  let sorted = [...list];
  if (type === 'low') sorted.sort((a,b) => a.price - b.price);
  else if (type === 'high') sorted.sort((a,b) => b.price - a.price);
  return sorted;
}

maleFilter.addEventListener('change', e => displayProducts(sortProducts(maleList, e.target.value), maleProductsEl));
femaleFilter.addEventListener('change', e => displayProducts(sortProducts(femaleList, e.target.value), femaleProductsEl));

// === POPUP ===
closePopupBtn.addEventListener('click', () => itemPopup.classList.remove('show'));
addPopupBtn.addEventListener('click', () => {
  if(currentPopupItem) {
    const inCart = cart.find(c => c.name === currentPopupItem.name);
    if (!inCart) {
      currentPopupItem.qty = 1;
      cart.push(currentPopupItem);
      toggleCartButton(currentPopupItem.name, true);
    }
    updateCartUI();
    itemPopup.classList.remove('show');
    showToast();
  }
});

// === TOAST ===
function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}