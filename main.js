// Welcome user
const userName = localStorage.getItem("loggedInAccount");
document.getElementById("welcome").innerHTML = `Welcome, ${userName}`;

// Show current balance on load
function onloadBalance() {
    const balance = document.getElementById("balance");
    const balanceAvailable = Number(localStorage.getItem("balance")) || 0;
    balance.innerHTML = `Rs. ${balanceAvailable}`;
}

// Show current expense total on load
function onloadExpense() {
    const expense = document.getElementById("expense");
    const expenseAmount = Number(localStorage.getItem("bal")) || 0;
    expense.innerHTML = `Rs. ${expenseAmount}`;
}

// Display transaction history
function displayHistory() {
    const history = JSON.parse(localStorage.getItem("history")) || [];
    const tableBody = document.getElementById("transactionHistory");
    tableBody.innerHTML = "";

    history.forEach(transaction => {
        const row = `<tr>
                        <td>${transaction.type}</td>
                        <td>${transaction.amount < 0 ? `- Rs.${Math.abs(transaction.amount)}` : `Rs.${transaction.amount}`}</td>
                        <td>Rs.${transaction.balance}</td>
                        <td>${transaction.date}</td>
                     </tr>`;
        tableBody.innerHTML += row;
    });
}

// Add income
function addIncome() {
    const incomeType = document.getElementById("incomeType").value;
    const income = document.getElementById("income").value;
    const balanceElement = document.getElementById("balance");

    if (!incomeType || !income) {
        alert('Enter valid income details');
        return;
    }

    const currentBalance = Number(localStorage.getItem("balance")) || 0;
    const incomeAmount = parseFloat(income);
    const newBalance = currentBalance + incomeAmount;

    const transaction = {
        type: incomeType,
        amount: incomeAmount,
        balance: newBalance,
        date: new Date().toLocaleString()
    };

    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(transaction);
    localStorage.setItem("history", JSON.stringify(history));

    balanceElement.innerHTML = `Rs. ${newBalance}`;
    localStorage.setItem("balance", newBalance);

    displayHistory();
    updateChart();
}

// Withdraw expense
function withdrow() {
    const expenseType = document.getElementById('expenseType').value;
    const expenseAmountInput = document.getElementById('expenseAmount').value;
    const balanceElement = document.getElementById("balance");
    const expenseElement = document.getElementById("expense");

    const expenseAmount = parseFloat(expenseAmountInput);
    const balance = Number(localStorage.getItem("balance")) || 0;

    if (!expenseType || !expenseAmount) {
        alert('Enter valid expense details');
        return;
    }

    if (balance < expenseAmount) {
        alert('Insufficient funds');
        return;
    }

    const newBalance = balance - expenseAmount;

    const oldExpenses = parseFloat(localStorage.getItem("bal")) || 0;
    const updatedExpenses = oldExpenses + expenseAmount;
    localStorage.setItem("bal", updatedExpenses);
    expenseElement.innerHTML = `Rs. ${updatedExpenses}`;

    const transaction = {
        type: expenseType,
        amount: -expenseAmount,
        balance: newBalance,
        date: new Date().toLocaleString()
    };

    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(transaction);
    localStorage.setItem("history", JSON.stringify(history));

    balanceElement.innerHTML = `Rs. ${newBalance}`;
    localStorage.setItem("balance", newBalance);

    displayHistory();
    updateChart();
}

// Update pie chart
function updateChart() {
    const history = JSON.parse(localStorage.getItem("history")) || [];

    let totalIncome = 0;
    let totalExpense = 0;

    history.forEach(transaction => {
        if (transaction.amount > 0) {
            totalIncome += transaction.amount;
        } else {
            totalExpense += Math.abs(transaction.amount);
        }
    });

    const ctx = document.getElementById("incomeExpenseChart").getContext("2d");

    if (window.myPieChart) {
        window.myPieChart.destroy();
    }

    window.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: ["#4CAF50", "#FF5733"],
            }]
        }
    });
}

// Clear all data
function clearAll() {
    document.getElementById("balance").innerHTML = `Rs. 0/-`;
    document.getElementById("expense").innerHTML = `Rs. 0/-`;

    // Clear localStorage values
    localStorage.setItem("balance", "0");
    localStorage.setItem("bal", "0");
    localStorage.removeItem("history");

    // Clear inputs
    document.getElementById("incomeType").value = "";
    document.getElementById("income").value = "";
    document.getElementById("expenseType").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("select").selectedIndex = 0;

    // Clear transaction history
    document.getElementById("transactionHistory").innerHTML = "";

    // Reset chart
    if (window.myPieChart) {
        window.myPieChart.destroy();
        window.myPieChart = null;
    }
}

// Logout
function logout() {
    localStorage.clear();
    window.location = "/index.html";
}

// Run on page load
window.onload = function () {
    onloadBalance();
    onloadExpense();
    displayHistory();
    updateChart();
};

// currency converter

var select = document.querySelectorAll('.currency'),
input_currency = document.getElementById('input_currency'),
output_currency = document.getElementById('output_currency');

const host = 'api.frankfurter.app';
fetch(`https://${host}/currencies`)
  .then(data => data.json())
  .then((data) => {
    const entries=Object.entries(data)
    // console.log(entries);
    for(i=0;i<entries.length; i++){
        select[0].innerHTML +=`<option value="${entries[i][0]}">${entries[i][0]}</option>`
        select[1].innerHTML +=`<option value="${entries[i][0]}">${entries[i][0]}</option>`
    }
    
  });

  function convert(){
    var inputvalue=input_currency.value;
    if(select[0].value != select[1].value){
        // alert('Right')

        const host = 'api.frankfurter.app';
        fetch(`https://${host}/latest?amount=${inputvalue}&from=${select[0].value}&to=${select[1].value}`)
          .then(val => val.json())
          .then((val) => {
            output_currency.value=Object.values(val.rates)[0]
          });
        
    }else{
        alert('please select two different currency')
    }
  }
