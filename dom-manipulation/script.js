// Array of quote objects
const quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Success is not final; failure is not fatal.", category: "Inspiration" },
    { text: "Knowledge is power.", category: "Education" }
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteContainer = document.getElementById("addQuoteContainer");

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = `"${quote.text}" — ${quote.category}`;
}

// Function to create Add Quote Form dynamically
function createAddQuoteForm() {
    const quoteInput = document.createElement("input");
    quoteInput.id = "newQuoteText";
    quoteInput.type = "text";
    quoteInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.id = "newQuoteCategory";
    categoryInput.type = "text";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";

    addButton.addEventListener("click", function () {
        addQuote();
    });

    addQuoteContainer.appendChild(quoteInput);
    addQuoteContainer.appendChild(document.createElement("br"));
    addQuoteContainer.appendChild(categoryInput);
    addQuoteContainer.appendChild(document.createElement("br"));
    addQuoteContainer.appendChild(addButton);
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both quote and category.");
        return;
    }

    quotes.push({
        text: quoteText,
        category: quoteCategory
    });

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
}

// Event Listener
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize form
createAddQuoteForm();
