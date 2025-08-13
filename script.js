const validEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!validEmail(email)) {
      alert("The format of Email is not valid!!");
      return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const existUser = users.find((user) => user.email === email);
    if (existUser) {
      if (existUser.password !== password) {
        alert("password is incorrect!");
        return;
      }
      localStorage.setItem("currentUser", JSON.stringify(existUser));
      alert(`Welcome To The Transaction Budget Dear ${existUser.email}`);
      window.location.href = "index.html";
    } else {
      alert("No account found with this email!, please sign up");
      return;
    }
  });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (confirmPassword !== password) {
      alert("The password is not match!");
      return;
    } else if (!validEmail(email)) {
      alert("The format of Email is not valid!!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const existUser = users.find((user) => user.email === email);
    if (existUser) {
      alert("This Email is already used!");
      return;
    }
    const user = { name, email, password };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registeration is Successfully :))");
    window.location.href = "login.html";
  });
}

const formatDate = (date) => {
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const greeting = document.getElementById("greeting");
const loginBtn = document.getElementById("loginButton");
const logoutBtn = document.getElementById("logoutButton");

document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const formattedDate = formatDate(today);
  const currentDate = document.getElementById("currentDate");
  if (currentDate) {
    currentDate.innerHTML = formattedDate;
  }

  let loginUser = JSON.parse(localStorage.getItem("currentUser"));
  if (loginUser) {
    greeting.innerHTML = `Hello, ${loginUser.name}`;
    logoutBtn.classList.remove("hidden");
    loginBtn.classList.add("hidden");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            location.reload();
      });
    }
  } else {
    logoutBtn.classList.add("hidden");
    greeting.innerHTML = `Hello, please`;
    if(loginBtn) {
        loginBtn.addEventListener("click", function () {
            window.location.href = "login.html";
        });
    }
  }
  const getChartBtn = document.getElementById("chartBtn");
  const closeChartBtn = document.getElementById("closeChart");
  const transactions = getUserTransaction();
  renderTransactions(transactions);
  balanceCalculate();
  deleteTransaction();
  filterList();

  if (getChartBtn) {
    getChartBtn.addEventListener("click", () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) {
        alert("Please, Login first!");
        return;
      }
      openChart();

      setupChart(getUserTransaction());
    });
  }
  if (closeChartBtn) {
    closeChartBtn.addEventListener("click", () => {
      closeChart();
    });
  }


});
const transactionForm = document.getElementById("transactionForm");
transactionForm.addEventListener('submit', function(e){
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let customAmount = Math.abs(Number(amount));
  if(type === "expense") {
      customAmount = -customAmount;
  }
  
  if (currentUser) {
      const transactionKey = `transactions_${currentUser.email}`;
      let transactions = JSON.parse(localStorage.getItem(transactionKey)) || [];
      const transaction = {
        id: Date.now(),
        title,
        amount: customAmount,
        type,
        category,
        date,
        cssClass: type,
      };
      transactions.push(transaction);
      localStorage.setItem(transactionKey, JSON.stringify(transactions));
      
  } else {
      alert("Please, first login");
      return
  }
  transactionForm.reset(); 
  const transactions = getUserTransaction();
  renderTransactions(transactions);
});

function getUserTransaction() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let transactions = [];
  if(currentUser) {
    const transactionKey = `transactions_${currentUser.email}`;
    transactions = JSON.parse(localStorage.getItem(transactionKey)) || [];
  } 
  return transactions;
}

function renderTransactions(list) {
  const transactionList = document.getElementById("transactionList");
  if (!transactionList) {
    return;
  } 
  if (list.length === 0) {
    transactionList.innerHTML = "<p>Transaction Lists are Empty</p>";
    return;
  }
  transactionList.innerHTML = "";
  list.forEach(item => {
    const newList = document.createElement('div');
    newList.className = `transaction-container ${item.type}`;
    newList.innerHTML = `
      <div class="budget-title">
          <h2>${item.type}: ${item.title}</h2>
      </div>
      <div class="budget-detail">  
          <p><strong>Category: </strong>${item.category}</p>
          <h3 class="price">${item.amount}$</h3>         
      </div>
      <div class="budget-date">
          <h5>${item.date}</h5>
          <button type="button" class="deleteBtn" data-id="${item.id}">Delete</button>
      </div>`;
    transactionList.append(newList); 
  });

}

function deleteTransaction(){
  const container = document.getElementById("transactionList");
  if(!container) return;

  container.addEventListener('click', function(e){
    const deleteBtn = e.target.closest(".deleteBtn");
    if(!deleteBtn) return;

    const transactionId = parseInt(deleteBtn.dataset.id, 10);    

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));    
    if(!currentUser) return;

    const transactionKey = `transactions_${currentUser.email}`;
    const list = JSON.parse(localStorage.getItem(transactionKey)) || [];    

    
    const exists = list.some((item) => item.id === transactionId);    
    if(!exists) return;
  

    const confirmation = confirm("Are you sure to delete Transaction? ");
    if(!confirmation) return;

    const newList = list.filter((item) => item.id !== transactionId);
    localStorage.setItem(transactionKey, JSON.stringify(newList));
    renderTransactions(newList);
    balanceCalculate();
    setupChart(newList);
  });
}

function balanceCalculate() {
  const balance = document.getElementById("balance");
  if (!balance) return;

  const transactions = getUserTransaction();
  let balanceTotal = 0;

  transactions.forEach((item) => {
    balanceTotal += parseFloat(item.amount);
  });

  balance.classList.remove("positive", "negative");
  if (balanceTotal > 0) {
    balance.classList.add("positive");
  } else if (balanceTotal < 0) {
    balance.classList.add("negative");
  }
  balance.innerHTML = `Balance: ${balanceTotal}`;
}

function filterList(){
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  searchInput.addEventListener("keyup", function (e) {
    const searchItem = e.target.value.trim().toLowerCase();
    console.log('search: ', searchItem);

    const cards = document.querySelectorAll(".transaction-container");
    if (!cards) return;

    let balanceTotal = []
    
    cards.forEach(card =>{
      const category = card.querySelector(".budget-detail p").textContent;
      const title = card.querySelector(".budget-title").textContent;
      const amount = card.querySelector(".price").textContent;
      const newAmount = parseFloat(amount);
      
      if (category.includes(searchItem) || title.includes(searchItem)) {
        card.style.removeProperty("display");
        balanceTotal.push(newAmount);

      } else {
        card.style.display = "none";
      }
    })
    updateBalanceFilter(balanceTotal);
  });
}

function updateBalanceFilter(transactions) {
  const balance = document.getElementById("balance");
  if (!balance) return;

  const total = transactions.reduce((sum, t) => sum + t, 0);

  balance.innerHTML = `Balance: ${total}`; 
   
  balance.classList.remove("positive", "negative");
  if (total > 0) {
    balance.classList.add("positive");
  } else if (total < 0) {
    balance.classList.add("negative");
  }
}

let chart = null;
function openChart(){
  const chartOverlay = document.getElementById("chartOverlay");
  const root = document.getElementById("rootPage");
  root.classList.add("blur");
  chartOverlay.classList.remove("hidden");
}

function closeChart() {
  const chartOverlay = document.getElementById("chartOverlay");
  const root = document.getElementById("rootPage");

  if (chart) {
    chart.destroy();
    chart = null;
  }
  chartOverlay.classList.add("hidden");
  root.classList.remove("blur");
}



function setupChart(transactions) {
  const ctx = document.getElementById("txChart").getContext("2d");
  const tx = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const labels = tx.map((t) => t.date);
  const incomeData = tx.map((t) =>
    t.type === "income" ? Number(t.amount) : 0
  );
  const expenseData = tx.map((t) =>
    t.type === "expense" ? Math.abs(Number(t.amount)) : 0
  );

  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = incomeData;
    chart.data.datasets[1].data = expenseData;
    chart.update();
  } else {
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            backgroundColor: "rgba(7, 125, 146, 1)",
          },
          {
            label: "Expense",
            data: expenseData,
            backgroundColor: "rgba(184, 110, 41, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { position: "top" } },
      },
    });
  }  
    
}






