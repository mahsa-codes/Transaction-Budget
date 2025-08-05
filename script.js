const validEmail = (email)=> {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
const loginForm = document.getElementById("loginForm");
if(loginForm) {
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password =  document.getElementById('password').value.trim();
        if(!validEmail(email)) {
            alert("The format of Email is not valid!!");
            return
        }
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existUser = users.find(user => user.email === email);
        if(existUser) {
            if(existUser.password !== password) {
                alert("password is incorrect!");
                return
            }
            localStorage.setItem('currentUser', JSON.stringify(existUser));
            alert(`Welcome To The Transaction Budget Dear ${existUser.email}`);
            window.location.href = "index.html";
        } else {
            alert("No account found with this email!, please sign up");
            return
        }

    });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener('submit', function(e){
        e.preventDefault();
        const name= document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password =  document.getElementById('password').value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (confirmPassword !== password) {
            alert("The password is not match!");
            return
        }
               
        else if(!validEmail(email)) {
            alert("The format of Email is not valid!!");
            return
        } 
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existUser = users.find(user => user.email === email)
        if (existUser) {
            alert("This Email is already used!");
            return
        } 
        const user = {name, email, password};
        users.push(user);    
        localStorage.setItem('users', JSON.stringify(users));
        alert("Registeration is Successfully :))");
        window.location.href = "login.html";

    });
}

