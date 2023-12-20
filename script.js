let totalInventoryPrice = 0;
let dailyTotals = Array(7).fill(0);
dailyTotals = [0, 130.45, 300.5, 50.3, 200.23, 250.45]
let dayIndex = 0;
const LOW_STOCK_THRESHOLD = 10; // Example threshold for low stock
const OVERSTOCK_THRESHOLD = 100; // Example threshold for overstock
const EXPIRY_THRESHOLD_DAYS = 10;

const dummyProducts = [
    { name: "ANT Keyboard", quantity: 15, price: 10.99, expiry: "" },
    { name: "Veggies", quantity: 5, price: 15.49, expiry: "2023-12-25" },
    { name: "Fruits", quantity: 20, price: 8.99, expiry: "2023-08-15" },
    { name: "Nuclear Bomb", quantity: 50, price: 5.49, expiry: "2024-05-20" },
    { name: "Med", quantity: 2, price: 20.00, expiry: "2023-07-30" }
];


document
    .getElementById("productForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        // Get the form values
        const productName = document.getElementById("productName").value;
        const productQuantity = document.getElementById("productQuantity").value;
        const productPrice = document.getElementById("productPrice").value;
        const productExpiry = document.getElementById("productExpiry").value;

        //total product price
        const totalPriceForProduct = productQuantity * productPrice;

        //prduct expiry calculation
        const currentDate = new Date();
        const expiryDate = new Date(productExpiry);
        const timeDiff = expiryDate.getTime() - currentDate.getTime();
        const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

        //total invetory price
        totalInventoryPrice += totalPriceForProduct;
        dailyTotals[dayIndex] += totalPriceForProduct;

        document.getElementById("totalPrice").textContent =
            totalInventoryPrice.toFixed(2);
        // Create a new row
        const table = document
            .getElementById("inventoryTable")
            .getElementsByTagName("tbody")[0];
        const newRow = table.insertRow(table.rows.length);

        newRow.innerHTML = `
        <td>${productName}</td>
        <td>${productQuantity}</td>
        <td>${productPrice}</td>
        <td>${productExpiry}</td>
    `;

        const expiryTable = document
            .getElementById("expiryTable")
            .getElementsByTagName("tbody")[0];
        const newExpiryRow = expiryTable.insertRow(expiryTable.rows.length);

        newExpiryRow.innerHTML = `
    <td>${productName}</td>
    <td>${productExpiry}</td>
    <td>${daysUntilExpiry}</td>
    `;

        if (daysUntilExpiry < 10) {
            newExpiryRow.classList.add("expiring-soon");
        }

        //chart functionality
        setInterval(() => {
            if (dayIndex < 6) {
                dayIndex++;
            } else {
                dailyTotals.shift(); // Remove the first day
                dailyTotals.push(0); // Add a new day
            }
        }, 24 * 60 * 60 * 1000); // Run daily

        updateChart();

        // Clear the form
        document.getElementById("productForm").reset();
    });


function updateChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "Yesterday", "Today"],
            labels: ["Today", "Yesterday", "2 day ago", "3 days ago", "4 days ago", "5 days ago", "6 days ago"],
            datasets: [{
                label: 'Total Inventory Value',
                data: dailyTotals,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function checkStockAndExpiry() {
    const products = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0].rows;

    for (let i = 0; i < products.length; i++) {
        const productName = products[i].cells[0].textContent;
        const productQuantity = parseInt(products[i].cells[1].textContent, 10);
        const productExpiry = new Date(products[i].cells[3].textContent);
        const daysUntilExpiry = calculateDaysUntilExpiry(productExpiry);

        // Check for low stock
        if (productQuantity <= LOW_STOCK_THRESHOLD) {
            alert(`Low stock alert for ${productName}`);
        }

        // Check for overstock
        if (productQuantity >= OVERSTOCK_THRESHOLD) {
            alert(`Overstock alert for ${productName}`);
        }

        // Check for nearing expiry
        if (daysUntilExpiry <= EXPIRY_THRESHOLD_DAYS) {
            alert(`Expiry alert for ${productName}: Only ${daysUntilExpiry} days left`);
        }
    }
}

function calculateDaysUntilExpiry(expiryDate) {
    const currentDate = new Date();
    const timeDiff = expiryDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}   

function insertDummyData() {
    dummyProducts.forEach(product => {
        const { name, quantity, price, expiry } = product;

        // Update total inventory price
        const totalPriceForProduct = quantity * price;
        totalInventoryPrice += totalPriceForProduct;
        dailyTotals[dayIndex] += totalPriceForProduct;

        // Update inventory table
        const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
        const newRow = inventoryTable.insertRow();
        newRow.innerHTML = `<td>${name}</td><td>${quantity}</td><td>${price.toFixed(2)}</td><td>${expiry}</td>`;

        // Calculate days until expiry and update expiry table
        const expiryDate = new Date(expiry);
        const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);
        const expiryTable = document.getElementById('expiryTable').getElementsByTagName('tbody')[0];
        const newExpiryRow = expiryTable.insertRow();

        newExpiryRow.innerHTML = `
            <td>${name}</td>
            <td>${expiry}</td>
            <td>${daysUntilExpiry}</td>
        `;

        // Highlight if expiring soon
        if (daysUntilExpiry < 10) {
            newExpiryRow.classList.add("expiring-soon");
        }
    });

    // Update the total inventory price display
    document.getElementById("totalPrice").textContent = totalInventoryPrice.toFixed(2);

    // Update the chart with new data
    updateChart();

    // Check for stock and expiry alerts
    checkStockAndExpiry();
}

window.onload = insertDummyData;