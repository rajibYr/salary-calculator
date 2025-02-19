const salaryInput = document.getElementById("salary");
const editButton = document.getElementById("edit-button");
const editPercentagesSection = document.getElementById("edit-percentages");
const toggleButtonsContainer = document.getElementById(
  "toggle-buttons-container"
);
const salaryBreakdown = document.getElementById("salary-breakdown");
const netSalaryDisplay = document.getElementById("net-salary");
const resultsSection = document.getElementById("results");

// Default percentages and toggles
const percentages = {
  da: 40,
  hra: 20,
  ta: 10,
  pf: 12,
  tda: 5,
  esi: 0.75,
};

const enabledComponents = {
  da: false,
  hra: false,
  ta: false,
  pf: false,
  tda: false,
  esi: false,
};

// Render percentage inputs
function renderPercentageInputs() {
  const percentageInputs = document.getElementById("percentage-inputs");
  percentageInputs.innerHTML = Object.entries(percentages)
    .map(
      ([key, value]) => `
      <div class="percentage-input">
        <label for="${key}">${key.toUpperCase()} (%):</label>
        <input
          type="number"
          id="${key}"
          value="${value}"
          onchange="updatePercentage('${key}', this.value)"
        />
      </div>
    `
    )
    .join("");
}

// Render toggle buttons
function renderToggleButtons() {
  toggleButtonsContainer.innerHTML = Object.entries(enabledComponents)
    .map(
      ([key, value]) => `
      <button
        class="toggle-button ${value ? "active" : "inactive"}"
        onclick="toggleComponent('${key}')"
      >
        ${key.toUpperCase()} ${value ? "✅" : "❌"}
      </button>
    `
    )
    .join("");
}

// Update percentage
function updatePercentage(key, value) {
  percentages[key] = parseFloat(value) || 0;
  calculateSalary();
}

// Toggle component
function toggleComponent(key) {
  enabledComponents[key] = !enabledComponents[key];
  renderToggleButtons();
  calculateSalary();
}

// Calculate salary
function calculateSalary() {
  const basic = parseFloat(salaryInput.value) || 0;

  const calculations = {
    da: enabledComponents.da ? basic * (percentages.da / 100) : 0,
    hra: enabledComponents.hra ? basic * (percentages.hra / 100) : 0,
    ta: enabledComponents.ta ? basic * (percentages.ta / 100) : 0,
    pf: enabledComponents.pf ? basic * (percentages.pf / 100) : 0,
    tda: enabledComponents.tda ? basic * (percentages.tda / 100) : 0,
    esi: enabledComponents.esi
      ? (basic +
          (enabledComponents.da ? basic * (percentages.da / 100) : 0) +
          (enabledComponents.hra ? basic * (percentages.hra / 100) : 0) +
          (enabledComponents.ta ? basic * (percentages.ta / 100) : 0)) *
        (percentages.esi / 100)
      : 0,
  };

  const totalAdditions = calculations.da + calculations.hra + calculations.ta;
  const totalDeductions = calculations.pf + calculations.esi + calculations.tda;
  const netSalary = basic + totalAdditions - totalDeductions;

  // Render salary breakdown
  salaryBreakdown.innerHTML = Object.entries(calculations)
    .map(
      ([key, value]) => `
      <tr>
        <td>${key.toUpperCase()}</td>
        <td>₹${value.toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  // Display net salary
  netSalaryDisplay.textContent = `₹${netSalary.toFixed(2)}`;

  // Show results section
  resultsSection.style.display = "block";
}

// Toggle edit mode
editButton.addEventListener("click", () => {
  editPercentagesSection.style.display =
    editPercentagesSection.style.display === "none" ? "block" : "none";
});

// Initialize
renderPercentageInputs();
renderToggleButtons();
salaryInput.addEventListener("input", calculateSalary);
