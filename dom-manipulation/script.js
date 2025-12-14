// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Knowledge is power.", category: "Education" },
    { text: "Success is not final; failure is not fatal.", category: "Inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteContainer = document.getElementById("addQuoteContainer");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}


// Populate category dropdown dynamically
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
        filterQuotes();
    }
}

// Filter quotes based on category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);

    let filteredQuotes = quotes;

    if (selectedCategory !== "all") {
        filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Display random quote + store session data
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;

    // Store last viewed quote in sessionStorage
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Restore last viewed quote from sessionStorage
function loadLastQuote() {
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    }
}

// Create Add Quote Form dynamically
function createAddQuoteForm() {
    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";

    addButton.addEventListener("click", addQuote);

    addQuoteContainer.appendChild(quoteInput);
    addQuoteContainer.appendChild(document.createElement("br"));
    addQuoteContainer.appendChild(categoryInput);
    addQuoteContainer.appendChild(document.createElement("br"));
    addQuoteContainer.appendChild(addButton);
}

// Add quote + persist to localStorage
function addQuote() {
    const text = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;

    if (!text || !category) {
        alert("Please fill in all fields");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
}

// Export quotes as JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();

    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert("Quotes imported successfully!");
        } catch {
            alert("Invalid JSON file");
        }
    };

    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize app
createAddQuoteForm();
loadLastQuote();
populateCategories();
