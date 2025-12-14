// Constants server URL
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// fetch quotes from server and sync with localStorage
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const data = await response.json();

        // Convert server posts into quote objects
        const serverQuotes = data.slice(0, 5).map(post => ({
            id: post.id,
            text: post.title,
            category: "Server",
            updatedAt: Date.now()
        }));

        syncWithServer(serverQuotes);
    } catch (error) {
        console.error("Error fetching server data:", error);
    }
}

// 
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
// Post new quote to server

async function postQuoteToServer(quote) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });

        const serverResponse = await response.json();
        console.log("Posted to server:", serverResponse);

        notifyUser("Quote synced to server successfully.");
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

// // Load quotes from localStorage or use default
// let quotes = JSON.parse(localStorage.getItem("quotes")) || [
//     { text: "Knowledge is power.", category: "Education" },
//     { text: "Success is not final; failure is not fatal.", category: "Inspiration" }
// ];




function syncQuotes(serverQuotes) {
    let conflictsResolved = false;

    serverQuotes.forEach(serverQuote => {
        const localIndex = quotes.findIndex(
            local => local.id === serverQuote.id
        );

        if (localIndex === -1) {
            // New server quote
            quotes.push(serverQuote);
            conflictsResolved = true;
        } else {
            // Conflict → server data takes precedence
            quotes[localIndex] = serverQuote;
            conflictsResolved = true;
        }
    });

    if (conflictsResolved) {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        notifyUser("Quotes synced from server. Conflicts resolved.");
    }
}


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

    const newQuote = {
        id: Date.now(),
        text: text,
        category: category,
        updatedAt: Date.now()
    };

    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // ✅ POST quote to mock server
    postQuoteToServer(newQuote);

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


function notifyUser(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 4000);
}

function manualSync() {
    fetchServerQuotes();
    notifyUser("Manual sync completed.");
}



// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteContainer.addEventListener("submit", addQuote);
categoryFilter.addEventListener("change", filterQuotes);
manualSyncBtn.addEventListener("click", manualSync);

// Initialize app
addQuote();
createAddQuoteForm();
loadLastQuote();
populateCategories();
fetchQuotesFromServer();
notifyUser();
syncQuotes();
