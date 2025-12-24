<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Marketplace | AbrakaHomes</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="navbar">
    <h1><a href="index.html">AbrakaHomes</a></h1>
    <nav>
      <a href="listings.html">Listings</a>
      <a href="marketplace.html">Marketplace</a>
    </nav>
  </header>

  <main class="market-container">
    <h2>Student Marketplace</h2>

    <form id="marketForm">
      <input type="text" id="itemName" placeholder="Item Name" required>
      <input type="text" id="itemDesc" placeholder="Description">
      <input type="number" id="itemPrice" placeholder="Price" required>
      <input type="text" id="itemContact" placeholder="WhatsApp / Phone">
      <button type="submit">Add Item</button>
    </form>

    <div id="marketList"></div>
  </main>

  <script src="marketplace.js"></script>
</body>
</html>
