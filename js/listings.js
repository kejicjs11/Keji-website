const listingsContainer = document.getElementById("listings-container");

const typeFilter = document.getElementById("typeFilter");
const locationFilter = document.getElementById("locationFilter");
const priceFilter = document.getElementById("priceFilter");

let allListings = [];

// Fetch hostels from backend
async function fetchListings() {
  try {
    const res = await fetch("/api/hostels");
    const data = await res.json();
    allListings = data;
    renderListings(allListings);
  } catch (err) {
    listingsContainer.innerHTML = "<p>Failed to load listings.</p>";
    console.error(err);
  }
}

// Render listings dynamically
function renderListings(listings) {
  listingsContainer.innerHTML = "";

  if (!listings.length) {
    listingsContainer.innerHTML = "<p>No listings found.</p>";
    return;
  }

  listings.forEach(listing => {
    const card = document.createElement("div");
    card.className = "listing-card";

    card.innerHTML = `
      <h3>${listing.title}</h3>
      <p class="price">₦${listing.price.toLocaleString()}</p>
      <p class="location">${listing.location}</p>
      <p class="type">${listing.type}</p>

      <div class="listing-actions">
        <a href="https://wa.me/${listing.agent.phone}" target="_blank" class="btn whatsapp">
          WhatsApp
        </a>

        <a href="chat.html?agent=${listing.agent._id}" class="btn chat">
          Chat
        </a>

        <a href="agent-profile.html?id=${listing.agent._id}" class="btn agent">
          View Agent
        </a>
      </div>
    `;

    listingsContainer.appendChild(card);
  });
}

// Apply filters
function applyFilters() {
  const typeValue = typeFilter.value;
  const locationValue = locationFilter.value;
  const priceValue = priceFilter.value;

  let filtered = allListings.filter(listing => {
    let matches = true;

    if (typeValue && listing.type !== typeValue) matches = false;
    if (locationValue && listing.location !== locationValue) matches = false;

    if (priceValue) {
      const [min, max] = priceValue.split("-").map(Number);
      if (listing.price < min || listing.price > max) matches = false;
    }

    return matches;
  });

  renderListings(filtered);
}

// Event listeners
typeFilter.addEventListener("change", applyFilters);
locationFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);

// Init
fetchListings();
