/* =========================================================
   Extreme Neat Motors: script.js
   1. The car list (edit this to add, change or remove cars)
   2. Search, budget and body type filters
   3. Brand logo carousel
   ========================================================= */

const PHONE = '254721912919';

/* SAMPLE DATA: replace the years, mileages, fuel types and prices with the
   dealership's real details. A car without "image" shows "Photo coming soon".
   Add  sold: true  to mark a car as sold. */
const cars = [
  { name: 'Toyota Noah',          type: 'Van',       year: 2015, mileage: 98000,  fuel: 'Petrol', price: 1350000, image: 'images/toyota-noah.webp' },
  { name: 'Mazda CX-5',           type: 'SUV',       year: 2014, mileage: 86000,  fuel: 'Petrol', price: 2300000, image: 'images/mazda-cx5.webp' },
  { name: 'Toyota Prado',         type: 'SUV',       year: 2013, mileage: 120000, fuel: 'Diesel', price: 4800000, image: 'images/tx-prado.webp' },
  { name: 'Toyota Vitz',          type: 'Hatchback', year: 2014, mileage: 74000,  fuel: 'Petrol', price: 750000,  image: 'images/toyota-vitz.webp' },
  { name: 'Toyota Axio',          type: 'Sedan',     year: 2015, mileage: 91000,  fuel: 'Petrol', price: 1100000, image: 'images/toyota-axio.webp' },
  { name: 'Nissan X-Trail',       type: 'SUV',       year: 2014, mileage: 105000, fuel: 'Petrol', price: 2100000, image: 'images/nissan-xtrail.webp' },
  { name: 'Toyota Hilux',         type: 'Pickup',    year: 2016, mileage: 110000, fuel: 'Diesel', price: 3400000, image: 'images/toyota-hilux.webp' },
  { name: 'Mitsubishi Outlander', type: 'SUV',       year: 2013, mileage: 99000,  fuel: 'Petrol', price: 1900000 },
  { name: 'Mercedes-Benz C200',   type: 'Sedan',     year: 2012, mileage: 88000,  fuel: 'Petrol', price: 2900000 },
  { name:'Honda Fit', type: 'Hatchback', year: 2015, mileage: 67000, fuel: 'Petrol', price: 850000, sold: true, image: 'images/honda-fit.webp' }
];

/* ---------- 2. Cards and filters ---------- */
const grid = document.getElementById('carGrid');
const countEl = document.getElementById('resultCount');
const noResults = document.getElementById('noResults');
const form = document.getElementById('searchForm');
const qInput = document.getElementById('q');
const budgetSel = document.getElementById('budget');
const typeSel = document.getElementById('type');

const money = n => n.toLocaleString('en-KE');

function cardHTML(c) {
  const msg = encodeURIComponent('Hi, I am interested in the ' + c.name);
  const photo = c.image
    ? `<img src="${c.image}" alt="${c.name}" width="400" height="240" loading="lazy">`
    : '<div class="photo-soon">Photo coming soon</div>';
  const badge = c.sold ? '<span class="badge-sold">Sold</span>' : '';
  const actions = c.sold
    ? '<p class="sold-note">This car has been sold.</p>'
    : `<div class="actions">
         <a class="btn btn-wa" href="https://wa.me/${PHONE}?text=${msg}">WhatsApp</a>
         <a class="btn btn-call" href="tel:+${PHONE}">Call</a>
       </div>`;
  return `
    <article class="card${c.sold ? ' is-sold' : ''}">
      <div class="card-media">${photo}${badge}</div>
      <div class="card-body">
        <h3>${c.name}</h3>
        <p class="meta">${c.type} &middot; ${c.year} &middot; ${money(c.mileage)} km &middot; ${c.fuel}</p>
        <p class="price">KES ${money(c.price)}</p>
        ${actions}
      </div>
    </article>`;
}

function applyFilters() {
  const term = qInput.value.toLowerCase().trim();
  const maxPrice = Number(budgetSel.value) || Infinity;
  const type = typeSel.value;

  const list = cars
    .filter(c => c.name.toLowerCase().includes(term) && c.price <= maxPrice && (!type || c.type === type))
    .sort((a, b) => Number(!!a.sold) - Number(!!b.sold));   // sold cars go last

  grid.innerHTML = list.map(cardHTML).join('');
  noResults.hidden = list.length > 0;
  countEl.textContent = list.length === cars.length
    ? `${cars.length} cars`
    : `Showing ${list.length} of ${cars.length} cars`;
}

[qInput, budgetSel, typeSel].forEach(el => {
  el.addEventListener('input', applyFilters);
  el.addEventListener('change', applyFilters);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  applyFilters();
  document.getElementById('cars').scrollIntoView();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  form.reset();
  applyFilters();
});

// Support links like index.html?q=prado&type=SUV
const params = new URLSearchParams(location.search);
if (params.get('q')) qInput.value = params.get('q');
if (params.get('budget')) budgetSel.value = params.get('budget');
if (params.get('type')) typeSel.value = params.get('type');
applyFilters();

/* ---------- 3. Brand logo carousel ---------- */
const track = document.getElementById('logoTrack');
const pauseBtn = document.getElementById('pauseBtn');

// Copy the logos once so the loop has no gap
[...track.children].forEach(li => {
  const copy = li.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelector('img').alt = '';
  track.appendChild(copy);
});
track.classList.add('is-animated');

pauseBtn.addEventListener('click', () => {
  const paused = track.classList.toggle('is-paused');
  pauseBtn.textContent = paused ? 'Play' : 'Pause';
  pauseBtn.setAttribute('aria-pressed', paused);
});
