// ===== 다크모드 =====
function toggleDark() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('myshop_dark', isDark ? '1' : '0');
  document.getElementById('darkToggleBtn').textContent = isDark ? '☀️' : '🌙';
}
(function initDark() {
  if (localStorage.getItem('myshop_dark') === '1') {
    document.body.classList.add('dark');
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('darkToggleBtn');
      if (btn) btn.textContent = '☀️';
    });
  }
})();

// ===== 상태 관리 =====
let currentUser = null;
let users = JSON.parse(localStorage.getItem('myshop_users') || '[]');
let cart = JSON.parse(localStorage.getItem('myshop_cart') || '[]');
let uploadedImages = []; // base64 배열

// v3: 카테고리 이미지 업데이트
localStorage.removeItem('myshop_products');
localStorage.removeItem('myshop_products_v2');
let products = JSON.parse(localStorage.getItem('myshop_products_v3') || 'null');
if (!products) {
  products = [
    {
      id: 1,
      name: "오버핏 그래픽 후디",
      desc: "Y2K 감성 넘치는 오버핏 그래픽 후디. 스트리트 룩을 완성하세요!",
      price: 49000,
      origPrice: 79000,
      category: "fashion",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=85",
      seller: "admin"
    },
    {
      id: 2,
      name: "유리피부 세럼 3종 세트",
      desc: "K-뷰티 글래스 스킨을 완성하는 세럼·에센스·선크림 풀 루틴.",
      price: 52000,
      origPrice: 82000,
      category: "beauty",
      badge: "NEW",
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=85",
      seller: "admin"
    },
    {
      id: 3,
      name: "수제 마카롱 박스 12입",
      desc: "파리지앵 레시피로 매일 아침 직접 구운 파스텔 컬러 마카롱.",
      price: 24000,
      origPrice: null,
      category: "food",
      badge: "인기",
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=500&q=85",
      seller: "admin"
    },
    {
      id: 4,
      name: "오픈이어 에어 이어버드",
      desc: "귀를 막지 않는 오픈이어 디자인. 공간음향 + 30시간 배터리.",
      price: 79000,
      origPrice: 119000,
      category: "digital",
      badge: "SALE",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=85",
      seller: "admin"
    },
    {
      id: 5,
      name: "소이왁스 아로마 캔들 세트",
      desc: "100% 천연 소이왁스 + 에센셜 오일. 미니멀 북유럽 감성 3종.",
      price: 36000,
      origPrice: 54000,
      category: "home",
      badge: "NEW",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=85",
      seller: "admin"
    },
    {
      id: 6,
      name: "Y2K 와이드 배기 팬츠",
      desc: "2000년대 감성 와이드 배기 핏. 지금 가장 핫한 데님 실루엣.",
      price: 45000,
      origPrice: 68000,
      category: "fashion",
      badge: "HOT",
      image: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=500&q=85",
      seller: "admin"
    },
    {
      id: 7,
      name: "그래놀라 스무디볼 키트",
      desc: "아사이볼·망고볼·딸기볼 3가지 플레이버. 건강한 아침의 시작.",
      price: 18000,
      origPrice: 26000,
      category: "food",
      badge: "NEW",
      image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&q=85",
      seller: "admin"
    },
    {
      id: 8,
      name: "미니멀 무드 LED 조명",
      desc: "16가지 색상 앱 제어. 책상·침실 감성 인테리어 필수 아이템.",
      price: 32000,
      origPrice: 48000,
      category: "home",
      badge: "BEST",
      image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500&q=85",
      seller: "admin"
    },
    {
      id: 9,
      name: "크롭 가죽 재킷",
      desc: "퀄리티 인조가죽 소재의 숏 크롭 바이커 재킷. 시즌리스 핵심 아이템.",
      price: 89000,
      origPrice: 135000,
      category: "fashion",
      badge: "BEST",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=85",
      seller: "admin"
    }
  ];
  saveProducts();
}

function saveProducts() { localStorage.setItem('myshop_products_v3', JSON.stringify(products)); }
function saveCart()     { localStorage.setItem('myshop_cart',     JSON.stringify(cart));     }
function saveUsers()    { localStorage.setItem('myshop_users',    JSON.stringify(users));    }

// ===== 렌더링 =====
let currentCategory = 'all';

function renderProducts(category = 'all') {
  const grid = document.getElementById('productsGrid');
  const filtered = category === 'all' ? products : products.filter(p => p.category === category);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-products"><div class="icon">📭</div><p>등록된 상품이 없습니다</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${p.image || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=85'}" alt="${p.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=85'" />
        ${p.badge ? `<span class="product-badge ${getBadgeClass(p.badge)}">${getBadgeLabel(p.badge)}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-price">
          ${p.price.toLocaleString()}원
          ${p.origPrice ? `<small>${p.origPrice.toLocaleString()}원</small>` : ''}
        </div>
        <div class="product-actions">
          <button class="btn-cart" onclick="addToCart(${p.id})">🛒 장바구니 담기</button>
          <button class="btn-wish" onclick="toggleWish(this)">🤍</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat, el) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderProducts(cat);
}

const categoryLabels = {
  all: '지금 가장 많은 사랑을 받고 있는 상품들',
  fashion: '👗 요즘 가장 핫한 패션 아이템',
  beauty: '💄 K-뷰티 트렌드 뷰티 상품',
  food: '🍱 건강하고 맛있는 트렌드 식품',
  digital: '💻 최신 디지털 & 테크 아이템',
  home: '🏠 감성 홈/리빙 인테리어 상품'
};

function filterCategoryCard(cat, el) {
  currentCategory = cat;

  // 카드 오버레이 스타일 초기화
  document.querySelectorAll('.cat-card-overlay').forEach(o => o.classList.remove('active-card'));
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active-card'));

  // 선택된 카드 활성화
  el.classList.add('active-card');
  const overlay = el.querySelector('.cat-card-overlay');
  if (overlay) overlay.classList.add('active-card');

  // 섹션 부제 업데이트
  const subtitle = document.getElementById('productSubtitle');
  if (subtitle) subtitle.textContent = categoryLabels[cat] || categoryLabels.all;

  renderProducts(cat);

  // 상품 섹션으로 부드럽게 스크롤
  document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 장바구니 =====
function addToCart(productId) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  const existing = cart.find(x => x.id === productId);
  if (existing) existing.qty++;
  else cart.push({ id: productId, qty: 1 });
  saveCart();
  updateCartCount();
  showToast(`"${p.name}"을(를) 장바구니에 담았습니다 🛒`, 'success');
}

function updateCartCount() {
  const total = cart.reduce((s, x) => s + x.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalArea  = document.getElementById('cartTotalArea');
  const subtitle   = document.getElementById('cartSubtitle');

  if (cart.length === 0) {
    subtitle.textContent = '';
    container.innerHTML = `<div class="cart-empty"><div class="icon">🛒</div><p>장바구니가 비어있습니다</p></div>`;
    totalArea.innerHTML = '';
    return;
  }

  subtitle.textContent = `총 ${cart.reduce((s,x)=>s+x.qty,0)}개의 상품`;
  container.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${p.image || ''}" alt="${p.name}"
             onerror="this.style.background='linear-gradient(135deg,#667eea,#764ba2)'" />
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${(p.price * item.qty).toLocaleString()}원</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${p.id})">✕</button>
      </div>
    `;
  }).join('');

  const total = cart.reduce((s, item) => {
    const p = products.find(x => x.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);

  totalArea.innerHTML = `
    <div class="cart-total">
      <div class="cart-total-row">
        <span>배송비</span><span>무료</span>
      </div>
      <div class="cart-total-row">
        <span style="font-weight:700;font-size:16px;">합계</span>
        <span class="cart-total-price">${total.toLocaleString()}원</span>
      </div>
    </div>
    <button class="btn-full btn-full-primary" style="margin-top:16px;" onclick="checkout()">
      💳 ${total.toLocaleString()}원 결제하기
    </button>
  `;
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

function checkout() {
  if (!currentUser) {
    closeModal('cartModal');
    showToast('로그인 후 결제하실 수 있습니다', 'info');
    openModal('loginModal');
    return;
  }
  cart = [];
  saveCart();
  updateCartCount();
  closeModal('cartModal');
  showToast('주문이 완료되었습니다! 감사합니다 🎉', 'success');
}

// ===== 로그인 / 회원가입 =====
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pw    = document.getElementById('loginPw').value;

  if (!email || !pw) { showToast('이메일과 비밀번호를 입력해주세요', 'error'); return; }

  const user = users.find(u => u.email === email && u.password === pw);
  if (!user) { showToast('이메일 또는 비밀번호가 틀렸습니다', 'error'); return; }

  currentUser = user;
  closeModal('loginModal');
  updateHeader();
  showToast(`${user.name}님, 환영합니다! 🎉`, 'success');
}

function doRegister() {
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pw    = document.getElementById('regPw').value;
  const pw2   = document.getElementById('regPw2').value;

  if (!name || !email || !pw) { showToast('모든 항목을 입력해주세요', 'error'); return; }
  if (pw.length < 6) { showToast('비밀번호는 6자 이상이어야 합니다', 'error'); return; }
  if (pw !== pw2)    { showToast('비밀번호가 일치하지 않습니다', 'error'); return; }
  if (users.find(u => u.email === email)) { showToast('이미 사용 중인 이메일입니다', 'error'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { showToast('올바른 이메일 형식을 입력해주세요', 'error'); return; }

  const newUser = { name, email, password: pw, phone: document.getElementById('regPhone').value };
  users.push(newUser);
  saveUsers();
  currentUser = newUser;
  closeModal('registerModal');
  updateHeader();
  showToast(`${name}님, 가입을 환영합니다! 🎉`, 'success');
}

function doLogout() {
  currentUser = null;
  updateHeader();
  showToast('로그아웃 되었습니다', 'info');
}

function updateHeader() {
  const area = document.getElementById('headerActions');
  if (currentUser) {
    area.innerHTML = `
      <div class="user-info">
        <div class="user-avatar">${currentUser.name[0]}</div>
        <span class="user-name">${currentUser.name}님</span>
      </div>
      <button class="btn btn-outline" onclick="checkLoginAndOpen()">상품 등록</button>
      <button class="btn btn-outline" onclick="doLogout()">로그아웃</button>
      <button class="cart-btn" onclick="openModal('cartModal')">
        🛒 장바구니
        <span class="cart-count" id="cartCount">${cart.reduce((s,x)=>s+x.qty,0)}</span>
      </button>
    `;
  } else {
    area.innerHTML = `
      <button class="btn btn-outline" onclick="openModal('loginModal')">로그인</button>
      <button class="btn btn-primary" onclick="openModal('registerModal')">회원가입</button>
      <button class="cart-btn" onclick="openModal('cartModal')">
        🛒 장바구니
        <span class="cart-count" id="cartCount">${cart.reduce((s,x)=>s+x.qty,0)}</span>
      </button>
    `;
  }
}

// ===== 상품 등록 =====
function checkLoginAndOpen() {
  if (!currentUser) {
    showToast('상품 등록은 로그인 후 가능합니다', 'info');
    openModal('loginModal');
    return;
  }
  openModal('addProductModal');
}

function addProduct() {
  const name     = document.getElementById('prodName').value.trim();
  const desc     = document.getElementById('prodDesc').value.trim();
  const price    = parseInt(document.getElementById('prodPrice').value);
  const origPrice = parseInt(document.getElementById('prodOrigPrice').value) || null;
  const category = document.getElementById('prodCategory').value;
  const badge    = document.getElementById('prodBadge').value.trim();
  const stock    = parseInt(document.getElementById('prodStock').value) || 1;

  if (!name)           { showToast('상품명을 입력해주세요', 'error'); return; }
  if (!desc)           { showToast('상품 설명을 입력해주세요', 'error'); return; }
  if (!price || price <= 0) { showToast('올바른 가격을 입력해주세요', 'error'); return; }

  const categoryImgs = {
    fashion: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=85',
    beauty:  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=85',
    food:    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=85',
    digital: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&q=85',
    home:    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500&q=85'
  };
  const image = uploadedImages.length > 0
    ? uploadedImages[0]
    : (categoryImgs[category] || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=85');

  const newProduct = {
    id: Date.now(),
    name, desc, price, origPrice, category, badge, stock, image,
    seller: currentUser.email
  };

  products.unshift(newProduct);
  saveProducts();
  closeModal('addProductModal');
  resetProductForm();
  renderProducts(currentCategory);
  showToast(`"${name}" 상품이 등록되었습니다! 🎉`, 'success');
}

function resetProductForm() {
  ['prodName','prodDesc','prodPrice','prodOrigPrice','prodBadge'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('prodStock').value = '1';
  uploadedImages = [];
  document.getElementById('imagePreview').innerHTML = '';
}

// ===== 이미지 업로드 =====
function handleFiles(files) {
  const maxFiles = 5;
  const remaining = maxFiles - uploadedImages.length;
  const toProcess = Array.from(files).slice(0, remaining);

  toProcess.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { showToast('이미지 크기는 10MB 이하여야 합니다', 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      uploadedImages.push(e.target.result);
      renderImagePreview();
    };
    reader.readAsDataURL(file);
  });

  if (files.length > remaining) showToast(`최대 ${maxFiles}장까지 업로드 가능합니다`, 'info');
}

function renderImagePreview() {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = uploadedImages.map((src, i) => `
    <div class="preview-item">
      <img src="${src}" alt="preview-${i}" />
      <button class="remove-img" onclick="removeImage(${i})">✕</button>
    </div>
  `).join('');
}

function removeImage(index) {
  uploadedImages.splice(index, 1);
  renderImagePreview();
}

function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.add('drag');
}
function handleDragLeave() {
  document.getElementById('uploadArea').classList.remove('drag');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.remove('drag');
  handleFiles(e.dataTransfer.files);
}

// ===== 뱃지 헬퍼 =====
function getBadgeClass(badge) {
  const b = badge.toUpperCase();
  if (b === 'HOT')              return 'badge-hot';
  if (b === 'NEW')              return 'badge-new';
  if (b === 'SALE')             return 'badge-sale';
  if (b === 'BEST')             return 'badge-best';
  if (b === '인기' || b === 'POPULAR') return 'badge-popular';
  return 'badge-default';
}
function getBadgeLabel(badge) {
  const b = badge.toUpperCase();
  if (b === 'HOT')              return '🔥 HOT';
  if (b === 'NEW')              return '✨ NEW';
  if (b === 'SALE')             return '🏷️ SALE';
  if (b === 'BEST')             return '👑 BEST';
  if (b === '인기' || b === 'POPULAR') return '❤️ 인기';
  return badge;
}

// ===== 찜하기 =====
function toggleWish(btn) {
  btn.classList.toggle('liked');
  btn.textContent = btn.classList.contains('liked') ? '❤️' : '🤍';
}

// ===== 모달 =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'cartModal') renderCart();
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function switchModal(from, to) { closeModal(from); openModal(to); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

// ===== 토스트 =====
let toastTimer;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  document.getElementById('toastIcon').textContent = icons[type] || '✅';
  document.getElementById('toastMsg').textContent = msg;
  toast.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = ''; }, 3000);
}

// ===== 유틸 =====
function scrollToTop()     { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToProducts() { document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' }); }

// ===== AI 챗봇 =====
let chatbotOpen = false;

const botResponses = {
  '상품 추천': [
    '현재 인기 상품으로는 <b>무선 블루투스 이어폰</b>과 <b>프리미엄 코튼 티셔츠</b>가 있어요! 🎧👕',
    '카테고리별로 추천드릴게요!\n• 패션 → 린넨 와이드 팬츠\n• 뷰티 → 수분 크림 세트\n• 디지털 → 무선 블루투스 이어폰'
  ],
  '배송': [
    '📦 배송 안내\n• 무료 배송: 전 상품 무료!\n• 배송 기간: 주문 후 2~3 영업일\n• 제주/도서산간: 추가 2~3일 소요될 수 있어요.',
    '🚚 오늘 오후 2시 이전 주문 시 당일 발송됩니다!\n배송 조회는 마이페이지에서 확인하세요.'
  ],
  '반품': [
    '🔄 반품/교환 안내\n• 상품 수령 후 7일 이내 신청\n• 단순 변심: 왕복 배송비 고객 부담\n• 불량/오배송: 전액 MYSHOP 부담\n\n고객센터: 1588-0000',
    '교환은 동일 상품 색상/사이즈만 가능합니다. 자세한 내용은 고객센터로 문의해 주세요! 😊'
  ],
  '회원가입': [
    '👤 회원가입 방법\n1. 우측 상단 "회원가입" 클릭\n2. 이름, 이메일, 비밀번호 입력\n3. 가입 완료!\n\n가입 시 즉시 쇼핑을 시작할 수 있어요 🎉',
  ],
  '로그인': [
    '🔐 우측 상단의 "로그인" 버튼을 클릭하면 로그인 화면이 나타납니다.\n가입하신 이메일과 비밀번호를 입력해 주세요!',
  ],
  '결제': [
    '💳 결제 방법\n• 신용카드, 체크카드\n• 카카오페이, 네이버페이\n• 무통장 입금\n\n장바구니에서 원하는 상품을 담고 결제하기를 눌러주세요!',
  ],
  '가격': [
    '현재 모든 상품에 <b>무료 배송</b>이 적용되고 있어요! 💸\n할인 상품은 뱃지(SALE, BEST)를 확인해 보세요.',
  ],
  '안녕': ['안녕하세요! 😊 무엇을 도와드릴까요?', '반갑습니다! 🤗 쇼핑에 대해 궁금한 것이 있으면 편하게 물어보세요!'],
  '감사': ['천만에요! 😊 더 궁금한 점이 있으면 언제든지 말씀해 주세요!', '도움이 됐다니 다행이에요! 🎉 즐거운 쇼핑 되세요~'],
  '고객': ['고객센터 📞\n• 전화: 1588-0000\n• 이메일: help@myshop.kr\n• 운영시간: 평일 09:00 ~ 18:00'],
  'default': [
    '죄송해요, 잘 이해하지 못했어요 😅\n아래 버튼을 눌러 자주 묻는 질문을 확인해 보세요!',
    '흠, 조금 더 자세히 설명해 주시면 도움을 드릴게요! 😊',
    '궁금하신 내용을 더 구체적으로 말씀해 주시겠어요? 최선을 다해 도와드릴게요! 🙏'
  ]
};

function toggleChatbot() {
  chatbotOpen = !chatbotOpen;
  const win    = document.getElementById('chatbotWindow');
  const notif  = document.getElementById('chatNotif');
  const fabImg = document.getElementById('fabImg');
  const fabClose = document.getElementById('fabClose');

  win.classList.toggle('open', chatbotOpen);
  notif.style.display = 'none';

  if (chatbotOpen) {
    fabImg.style.display = 'none';
    fabClose.style.display = 'flex';
    document.getElementById('chatInput').focus();
    initHeaderStars();
  } else {
    fabImg.style.display = 'block';
    fabClose.style.display = 'none';
  }
}

function initHeaderStars() {
  const container = document.getElementById('headerStars');
  if (container.children.length > 0) return;
  for (let i = 0; i < 18; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%; top:${Math.random()*100}%;
      animation-delay:${Math.random()*4}s;
      animation-duration:${Math.random()*3+3}s;
    `;
    container.appendChild(star);
  }
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendMessage(text, 'user');
  document.getElementById('quickBtns')?.remove();
  showTyping();
  setTimeout(() => {
    removeTyping();
    const reply = getBotReply(text);
    appendMessage(reply, 'bot');
  }, 900 + Math.random() * 500);
}

function quickSend(text) {
  document.getElementById('chatInput').value = text;
  sendChat();
}

function appendMessage(text, who) {
  const container = document.getElementById('chatMessages');
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

  const wrap = document.createElement('div');
  wrap.className = `chat-msg-wrap ${who}`;

  const botAvatar = `<img class="chat-mini-avatar"
    src="https://api.dicebear.com/8.x/bottts-neutral/svg?seed=myshop&backgroundColor=1a1a2e&eyes=happy&mouth=smile01"
    alt="AI"
    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>'" />`;

  const userInitial = currentUser ? currentUser.name[0] : '나';
  const userAvatar = `<div class="chat-mini-user">${userInitial}</div>`;

  wrap.innerHTML = `
    ${who === 'bot' ? botAvatar : ''}
    <div class="chat-msg ${who}">
      <div class="chat-bubble">${text.replace(/\n/g,'<br>')}</div>
      <div class="chat-time">${timeStr}</div>
    </div>
    ${who === 'user' ? userAvatar : ''}
  `;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg-wrap bot';
  wrap.id = 'typingIndicator';
  wrap.innerHTML = `
    <img class="chat-mini-avatar"
      src="https://api.dicebear.com/8.x/bottts-neutral/svg?seed=myshop&backgroundColor=1a1a2e&eyes=happy&mouth=smile01"
      alt="AI"
      onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>'" />
    <div class="chat-typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
  `;
  container.appendChild(wrap);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

function getBotReply(text) {
  const t = text.toLowerCase();
  for (const [key, replies] of Object.entries(botResponses)) {
    if (key === 'default') continue;
    if (t.includes(key)) return replies[Math.floor(Math.random() * replies.length)];
  }
  const defaults = botResponses['default'];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

// ===== 초기화 =====
updateCartCount();
renderProducts();