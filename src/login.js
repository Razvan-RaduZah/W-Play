function login() {
    document.getElementById("error").innerHTML = "";
    let user = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    const userObject = getUserByUsername(user);
    if (userObject && userObject.password == password) {
        storeUser(userObject)
        document.location.href = "menu.html"
    }
    else {
        document.getElementById("error").innerHTML = "Wrong username or password !";
    }
}

function storeUser(user) {
    localStorage.setItem("user", JSON.stringify(user))
}

function getUserByUsername(username) {
    const user = localStorage.getItem("user:" + username);
    if (user) {
        return JSON.parse(user)
    } else {
        return null
    }
}

function registerUser(user) {
    localStorage.setItem("user:" + user.user, JSON.stringify(user))
}

function singUp() {
    document.location.href = "singUp.html"
}
function create() {
    let newUser = document.getElementById("newEmail").value
    let newPassword = document.getElementById("newPassword").value
    let registerUser1 = {
        user: newUser,
        password: newPassword
    }
    if (getUserByUsername(newUser)) {
        document.getElementById("error1").innerHTML = "Username  already in use!";
    } else {
        registerUser(registerUser1)
        document.location.href = "login.html"
    }
}



