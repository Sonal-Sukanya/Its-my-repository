const balance = document.getElementById(
    "balance"
  );
  const dailyExpense = document.getElementById("daily-expense");
const monthlyExpense = document.getElementById("monthly-expense");
  const list = document.getElementById("list");
  const form = document.getElementById("form");
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");
  const dateInput = document.getElementById("date");

  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function clearFormInputs() {
    text.value = "";
    amount.value = "";
    dateInput.value = "";
}


  function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === "" || amount.value.trim() === "" || dateInput.value.trim() === "") {
        alert("Please add text, amount, and date");
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value, 
        date: dateInput.value,
    };

    transactions.push(transaction);
    updateLocalStorage();
    Init();
    clearFormInputs();
}

  function generateID(){
    return Math.floor(Math.random()*1000000000);
  }
  function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
  
    list.appendChild(item);
  }

  function updateValues() {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const dailyTotal = transactions
        .filter(transaction => transaction.date === today)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const monthlyTotal = transactions
        .filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return (
                transactionDate.getFullYear() === currentYear &&
                transactionDate.getMonth() + 1 === currentMonth
            );
        })
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    balance.innerText = `$${totalBalance.toFixed(2)}`;
    dailyExpense.innerText = `$${dailyTotal.toFixed(2)}`;
    monthlyExpense.innerText = `$${monthlyTotal.toFixed(2)}`;
}
  
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocalStorage();
    Init(); 
  }

  
  function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
  }

  
  function Init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
  }

  let lastCheckedDate = new Date();
function checkForMonthOrYearChange() {
    const currentDate = new Date();
    if (
        lastCheckedDate.getMonth() !== currentDate.getMonth() ||
        lastCheckedDate.getFullYear() !== currentDate.getFullYear()
    ) {
        lastCheckedDate = currentDate;
        console.log("Month or Year has changed");
        init(); // Recalculate and re-render
    }
}

setInterval(checkForMonthOrYearChange, 3600000);
  
  Init();
  
  form.addEventListener('submit',addTransaction);
  
  