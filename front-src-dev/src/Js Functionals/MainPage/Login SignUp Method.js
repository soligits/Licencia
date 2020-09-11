import Cookies from 'js-cookie';
import {httpExcGET, parseValue} from "../AlphaAPI";
import {urlSignUp, urlLogin} from "../urlNames";
import {profilePagePath} from "../PagePaths";
import {goToPage} from "../PageRouter";

let signUpUsername
let signUpFirstName
let signUpLastName
let signUpEmail
let signUpPassword
let signUpRepeatPassword
let signupKind
let signUpCloseModalFunc;

function setSignUpFields() {
    signUpUsername = document.getElementById("SignUp-UserName")
    signUpFirstName = document.getElementById("SignUp-FirstName")
    signUpLastName = document.getElementById("SignUp-LastName")
    signUpEmail = document.getElementById("SignUp-Email")
    signUpPassword = document.getElementById("SignUp-Password")
    signUpRepeatPassword = document.getElementById("SignUp-RepeatPassword")
    signupKind = document.getElementById("signUpKind")
}

export function emptySignUpFields() {
    setSignUpFields();
    signUpUsername.value = "";
    signUpFirstName.value = "";
    signUpLastName.value = "";
    signUpEmail.value = "";
    signUpPassword.value = "";
    signUpRepeatPassword.value = "";
    signupKind.value = "";
}

export function signUp(func) {
    signUpCloseModalFunc = func
    setSignUpFields();
    var doc = hasEmpty(signUpUsername, signUpFirstName, signUpLastName, signUpEmail, signUpPassword, signUpRepeatPassword)
    if (doc != null) {
        setFieldError(doc, true)
        setTimeout(() => alert("fill the red box!!"), 1000);
    } else {
        if (signUpPassword.value !== signUpRepeatPassword.value) {
            alert("Your Passwords Doesn't Match")
            setFieldError(signUpPassword, true)
            setFieldError(signUpRepeatPassword, true)
            return;
        }
        const data = {
            username: signUpUsername.value,
            'first-name': signUpFirstName.value,
            'last-name': signUpLastName.value,
            email: signUpEmail.value,
            password: signUpPassword.value
        }
        alert('data: ' + JSON.stringify(data))
        const promise = httpExcGET('post', urlSignUp, data, handleSuccessSignUp, handleErrorSignUp, {
            'Content-Type': 'application/json'
        }, {
            key: 'account-type',
            value: signupKind.value
        });
    }
}

function handleSuccessSignUp(value) {
    alert("SignUp Successful")
    emptySignUpFields();
    signUpCloseModalFunc()
    // closeTheFuckinModal
}

function handleErrorSignUp(value) {
    // todo error the fields
    alert("SignUp Failed")
    alert('Server Message: ' + value.message)
    switch (value.message) {
        case 'duplicate email':
            setFieldError(signUpEmail, true);
            break;
        case 'duplicate username':
            setFieldError(signUpUsername, true)
            break;
        default:
            alert("Haven't Handled That Error Before");
            console.log("messageError: '" + value.messageError + "'")
    }
}


let loginKeypoint;
let loginPassword;
let loginKind;
let loginCloseModalFunc;

function setLoginFields() {
    loginKeypoint = document.getElementById("login-KeyPoint");
    loginPassword = document.getElementById("login-Password");
    loginKind = document.getElementById("loginKind");
}

export function emptyLoginFields() {
    setLoginFields();
    loginKeypoint.value = "";
    loginPassword.value = "";
    loginKind.value = "";
}

export function login(func) {
    loginCloseModalFunc = func;
    setLoginFields()
    let doc = hasEmpty(loginKeypoint, loginPassword);
    if (doc != null) {
        setFieldError(doc, true)
        setTimeout(() => alert("fill the red box!!"), 1000);
    } else {
        const data = {
            id: loginKeypoint.value,
            password: loginPassword.value
        }
        alert('data: ' + JSON.stringify(data))
        const promise = httpExcGET('post', urlLogin, data, handleSuccessLogin, handleErrorLogin, {
            'Content-Type': 'application/json'
        }, {
            key: 'account-type',
            value: loginKind.value
        });

    }
}

function handleSuccessLogin(value) {
// todo go to Profile Menu And Save Auth
    alert("Login Successful")
    Cookies.set("isfreelancer", loginKind.value === "freelancer");
    goToPage(profilePagePath);
    emptyLoginFields();
}

function handleErrorLogin(value) {
    // todo error the fields
    fillLoginErrorFields()
    alert("Login Failed")
    alert('Server Message: ' + value.message)
    setFieldError(loginPassword, true);
    setFieldError(loginKeypoint, true);

    switch (value.message) {
        case 'not signed up username':
        case 'not signed up email':
            wrongLoginKeyPoint()
            break;
        case 'invalid password':
            wrongLoginPassword()
            break;
        default:
            alert("Haven't Handled That Error Before");
            console.log("messageError: '" + value.message + "'")
    }
}

let loginKeyPointError;
let loginPasswordError;

function fillLoginErrorFields() {
    loginKeyPointError = document.getElementById('loginKeyPointError')
    loginPasswordError = document.getElementById('loginPasswordError')
}

function wrongLoginKeyPoint() {
    loginKeypoint.value = ""
    loginKeyPointError.style.display = 'block'
}

function wrongLoginPassword() {
    loginPassword.value = "";
    loginPasswordError.style.display = 'block'

}

function hasEmpty(...args) {
    for (let doc of args) {
        if (doc.value === "") {
            return doc;
        }
    }
    return null;
}

function setFieldError(field, isError) {
    if ((isError === undefined || isError) && !field.parentElement.classList.contains("error")) {
        // field.style.border = "1px solid red";
        field.parentElement.classList.add("error");
    } else if (!isError && field.parentElement.classList.contains("error")) {
        field.parentElement.classList.remove("error")
    }
}
