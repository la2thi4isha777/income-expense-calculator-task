const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addBtn = document.getElementById("add-btn");
const resetBtn = document.getElementById("reset-btn");
const entriesList = document.getElementById("entries-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;

// Render entries
function renderEntries(filter = "all") {
  entriesList.innerHTML = "";

  let filtered = entries.filter(e => 
    filter === "all" ? true : e.type === filter
  );

  filtered.forEach((entry, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="entry-text">${entry.desc} - ${entry.amount} (${entry.type})</span>
      <span class="entry-actions">
        <button class="edit" onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </span>
    `;

    entriesList.appendChild(li);
  });

  updateTotals();
}

// Update totals
function updateTotals() {
  let income = entries
    .filter(e => e.type === "income")
    .reduce((acc, e) => acc + e.amount, 0);

  let expense = entries
    .filter(e => e.type === "expense")
    .reduce((acc, e) => acc + e.amount, 0);

  totalIncomeEl.textContent = income;
  totalExpenseEl.textContent = expense;
  netBalanceEl.textContent = income - expense;
}

// Add or update entry
function addEntry() {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!desc || isNaN(amount)) {
    alert("Please enter description and valid amount.");
    return;
  }

  if (editId !== null) {
    entries[editId] = { desc, amount, type: typeInput.value };
    editId = null;
  } else {
    entries.push({ desc, amount, type: typeInput.value });
  }

  saveEntries();
  renderEntries();
  resetForm();
}

// Edit entry
function editEntry(index) {
  const entry = entries[index];
  descInput.value = entry.desc;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editId = index;
}

// Delete entry
function deleteEntry(index) {
  entries.splice(index, 1);
  saveEntries();
  renderEntries();
}

// Save to local storage
function saveEntries() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

// Reset form
function resetForm() {
  descInput.value = "";
  amountInput.value = "";
  typeInput.value = "income";
}

// Event listeners
addBtn.addEventListener("click", addEntry);
resetBtn.addEventListener("click", resetForm);

// Filters
document.querySelectorAll("input[name='filter']").forEach(radio => {
  radio.addEventListener("change", e => renderEntries(e.target.value));
});

// Init
renderEntries();
