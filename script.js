const display = document.getElementById("display");

let expression = "0";
let showingResult = false;

function updateDisplay() {
  display.value = expression;
}

function isOperator(char) {
  return ["+", "-", "*", "/"].includes(char);
}

function getLastNumberPart(text) {
  const parts = text.split(/[\+\-\*\/]/);
  return parts[parts.length - 1];
}

function inputDigit(digit) {
  if (showingResult || expression === "Ошибка") {
    expression = digit;
    showingResult = false;
    updateDisplay();
    return;
  }

  if (expression === "0") {
    expression = digit;
  } else {
    expression += digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (showingResult || expression === "Ошибка") {
    expression = "0.";
    showingResult = false;
    updateDisplay();
    return;
  }

  const lastChar = expression[expression.length - 1];
  const lastNumber = getLastNumberPart(expression);

  if (isOperator(lastChar)) {
    expression += "0.";
  } else if (!lastNumber.includes(".")) {
    expression += ".";
  }

  updateDisplay();
}

function setOperator(nextOperator) {
  if (expression === "Ошибка") {
    return;
  }

  showingResult = false;
  const lastChar = expression[expression.length - 1];

  if (isOperator(lastChar)) {
    expression = expression.slice(0, -1) + nextOperator;
  } else {
    expression += nextOperator;
  }

  updateDisplay();
}

function calculate() {
  if (expression === "Ошибка") {
    return;
  }

  const sanitizedExpression = expression.replace(/÷/g, "/").replace(/×/g, "*");
  const lastChar = sanitizedExpression[sanitizedExpression.length - 1];

  if (isOperator(lastChar)) {
    return;
  }

  try {
    const result = Function(`"use strict"; return (${sanitizedExpression});`)();

    if (!Number.isFinite(result)) {
      expression = "Ошибка";
    } else {
      expression = String(Number(result.toFixed(10)));
      showingResult = true;
    }
  } catch {
    expression = "Ошибка";
  }

  updateDisplay();
}

function clearAll() {
  expression = "0";
  showingResult = false;
  updateDisplay();
}

function backspace() {
  if (showingResult || expression === "Ошибка") {
    clearAll();
    return;
  }

  expression = expression.length > 1 ? expression.slice(0, -1) : "0";
  updateDisplay();
}

document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const { action, value } = button.dataset;

  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "operator":
      setOperator(value);
      break;
    case "equals":
      calculate();
      break;
    case "clear":
      clearAll();
      break;
    case "backspace":
      backspace();
      break;
    default:
      break;
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/\d/.test(key)) {
    inputDigit(key);
    return;
  }

  if (key === ".") {
    inputDecimal();
    return;
  }

  if (["+", "-", "*", "/"].includes(key)) {
    setOperator(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === "Escape") {
    clearAll();
    return;
  }

  if (key === "Backspace") {
    backspace();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("service-worker.js");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}
