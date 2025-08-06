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
});
