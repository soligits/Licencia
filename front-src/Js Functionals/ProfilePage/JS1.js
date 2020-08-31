const usernameField = document.getElementById("usernameField");
const shownNameField = document.getElementById('showingNameField')
const firstNameField = document.getElementById("firstNameField");
const lastNameField = document.getElementById("lastNameField");
const emailField = document.getElementById("emailField");
const siteAddressField = document.getElementById("siteAddressField");
const telephoneNumberField = document.getElementById("telephoneNumberField");
const passwordField = document.getElementById("passwordField");
const repeatPasswordField = document.getElementById("repeatPasswordField");
const gitHubAccountField = document.getElementById("githubAccountField");
const descriptionField = document.getElementById("descriptionField");
const addressField = document.getElementById("addressField");

let username;
let shownName;
let firstname;
let lastname;
let email;
let siteAddress;
let telephoneNumber;
let password;
let gitHubAccount;
let gitHubRepo;
let description;
let address;
let projectsId;
let requestedProjectsId;

function logOut() {
    // Todo
    window.location.href = mainPageName;
}

const gitHubAccountPart = document.getElementById("gitHubAccountPart");

function initGithubRepos() {
    firstRepoDiv.style.display = 'none';
    secondRepoDiv.style.display = 'none';
    thirdRepoDiv.style.display = 'none';
    iconDiv.style.display = 'none';
}

function loadProfileMenu() {
    if (/*!Cookies.get('isfreelancer')*/ false) {
        httpGet(urlGetEmployerProfileInfo, {
            'Content-Type': 'application/json',
            'token': Cookies.get('auth')
        }, handleSuccessGetProfileInfo, handleDenyGetProfileInfo);
        gitHubAccountPart.style.display = "none";
    } else {
        httpGet(urlGetFreelancerProfileInfo, {
            'Content-Type': 'application/json',
            'token': Cookies.get('auth')
        }, handleSuccessGetProfileInfo, handleDenyGetProfileInfo);
    }
    $('#' + gitHubRepoContent.id).transition(MainProfileTransition)
    $('#' + profile.id).transition(MainProfileTransition).transition(MainProfileTransition)
    initGithubRepos();
}

function handleSuccessGetProfileInfo(value) {
    console.log("message : " + value.message);
    let messages = JSON.parse(value.message);
    username = messages.username;
    shownName = messages['shown-name']
    firstname = messages.firstname;
    lastname = messages.lastname;
    email = messages.email;
    description = messages.description;
    telephoneNumber = messages.phonenumber;
    address = messages.addr;
    password = messages.password;
    projectsId = messages['project-ids'];
    if (Cookies.get('isfreelancer')) {
        gitHubAccount = messages.github;
        gitHubRepo = messages['github-repos'];
        siteAddress = messages.website;
        requestedProjectsId = messages['req-project-ids'];
        fillFreelancerSpecialFields();
    } else {
        fillCommonFields();
    }

}

function fillFreelancerSpecialFields() {
    siteAddressField.value = siteAddress;
    //TODO : remaining;
}

function fillCommonFields() {
    usernameField.value = username;
    firstNameField.value = firstname;
    lastNameField.value = lastname;
    emailField.value = email;
    telephoneNumberField.value = telephoneNumber;
    addressField.value = address;
    descriptionField.value = description;
    passwordField.value = password;
}

function handleDenyGetProfileInfo(value) {
    alert(JSON.stringify(value));
    console.log("raft too handleDenyGetProfileInfo");
}

const repoDiv = document.getElementById("addRepoDiv");
const iconDiv = document.getElementById("plusRepoIconDiv");
const repoInput = document.getElementById("addRepoInput");
const firstRepoDiv = document.getElementById("firstRepo");
const secondRepoDiv = document.getElementById("secondRepo");
const thirdRepoDiv = document.getElementById("thirdRepo");
const firstRepoLink = document.getElementById("linkRepo1");
const secondRepoLink = document.getElementById("linkRepo2");
const thirdRepoLink = document.getElementById("linkRepo3");
const githubAccountField = document.getElementById("githubAccountField");
const gitHubReposDiv = document.getElementById("gitHubRepos");

function openAddRepoDiv() {
    let counter = 0;
    if (firstRepoDiv.style.display !== "none") counter += 1;
    if (secondRepoDiv.style.display !== "none") counter += 1;
    if (thirdRepoDiv.style.display !== "none") counter += 1;
    if (counter === 3) {
        alert("you can have only 3 repository")
        return;
    }
    repoDiv.style.display = "block";
    iconDiv.style.display = "none";
    repoInput.value = "";
    repoInput.focus();
}


function closeAddRepoDiv() {
    if (repoInput.value === "") {
        // $ep
        repoDiv.style.display = "none";
        iconDiv.style.display = "block";
        return;
    }
    if (firstRepoDiv.style.display === "none") {
        showRepo(firstRepoDiv, firstRepoLink, repoInput.value)
    } else if (secondRepoDiv.style.display === "none") {
        showRepo(secondRepoDiv, secondRepoLink, repoInput.value)
    } else if (thirdRepoDiv.style.display === "none") {
        showRepo(thirdRepoDiv, thirdRepoLink, repoInput.value)
    } else {
        alert("you can have only 3 repository")
        return;
    }
    repoDiv.style.display = "none";
    iconDiv.style.display = "block";
    repoInput.value = "";
    let counter = 0;
    if (firstRepoDiv.style.display !== "none") counter += 1;
    if (secondRepoDiv.style.display !== "none") counter += 1;
    if (thirdRepoDiv.style.display !== "none") counter += 1;
    if (counter === 3) {
        iconDiv.style.display = "none";
    }
}

function showRepo(repoDiv, repoLink, text) {
    let textNode = document.createTextNode(text);
    removeAllChild(repoLink);
    repoLink.appendChild(textNode);
    repoLink.href = gitHubUrl + text
    repoDiv.style.display = "block";
}

function removeRepo(element) {
    element.style.display = "none";
    iconDiv.style.display = "block";
}

function removeAllChild(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function accountGithubChanged() {
    if (githubAccountField.value === "") {
        firstRepoDiv.style.display = "none";
        secondRepoDiv.style.display = "none";
        thirdRepoDiv.style.display = "none";
        repoDiv.style.display = "none";
        iconDiv.style.display = "none";
    } else {
        iconDiv.style.display = "block";
    }
}

const MainProfileTransition = 'fade up';
const mainProfileContent = document.getElementById('MainProfileContent');
const profile = document.getElementById('profile');
const gitHubRepoContent = document.getElementById('githubReposContent');
const changePasswordContent = document.getElementById('changingPasswordContent');

function changeMainProfileContent(content) {
    let showingDisplay = getShowingDisplay();
    if (showingDisplay != null && content.id !== showingDisplay.id) {
        $('#' + showingDisplay.id).transition(MainProfileTransition);
        $('#' + content.id).transition(MainProfileTransition);
    }
}

function getShowingDisplay() {
    for (let childElement of mainProfileContent.children) {
        console.log('showingDisplay: ' + childElement.id)
        console.log('****: ' + childElement.style.display)
        if (childElement.style.display != '' && childElement.style.display !== 'none') {
            return childElement;
        }
    }
    return null;
}


function modal(modalId, command) {
    if (document.getElementById(modalId) != null) {
        $('#' + modalId)
            .modal(command);
    }
}

function successSaveProfile(value) {
    alert('Profile Saved Successfully')
}

function errorSaveProfile(value) {
    //Error Handling
}

function saveProfile() {
    let getValue = (firstValue, secondValue) => secondValue == null ? firstValue : secondValue;
    const data = {
        'shown-name': getValue(shownName, shownNameField.value),
        'firstname': getValue(firstname, firstNameField.value),
        'lastname': getValue(lastname, lastNameField.value),
        'phonenumber': getValue(telephoneNumber, telephoneNumberField.value),
        'addr': getValue(address, addressField.value),
        'description': getValue(description, descriptionField.value)
    }
    httpExcGET('post', saveProfileUrl, data, successSaveProfile, errorSaveProfile, {
        'auth': Cookies.get('auth')
    })
}

function submitGitPart() {
    let gitLinks = [];
    let size = 0;
    if (firstRepoDiv.style.display !== "none") {
        gitLinks[size] = $('#linkRepo1').text();
        size += 1;
    }
    if (secondRepoDiv.style.display !== "none") {
        gitLinks[size] = $('#linkRepo2').text();
        size += 1;
    }
    if (thirdRepoDiv.style.display !== "none") {
        gitLinks[size] = $('#linkRepo3').text();
        size += 1;
    }
    let data = {
        'website': siteAddressField.value,
        'github-repos': gitLinks,
        'github': githubAccountField.value
    }
    siteAddress = siteAddressField.value;
    gitHubAccount = githubAccountField.value;
    let headers = {
        'Content-Type': 'application/json',
        'token': Cookies.get('auth')
    }
    httpExcGET('POST', saveGithubUrl, data, successGithubPartSubmit, denyGithubPartSubmit, headers);
}

function successGithubPartSubmit(value) {
    alert("post successfully" + " value : " + JSON.stringify(value));
}

function denyGithubPartSubmit(value) {
    alert("post deny" + " value : " + JSON.stringify(value));
}

const oldPasswordField = document.getElementById("oldPasswordField");
const newPasswordField = document.getElementById("passwordField");
const repeatNewPasswordField = document.getElementById("repeatPasswordField");

function changePassword() {
    if (oldPasswordField.value === "" || newPasswordField.value === "" || repeatNewPasswordField.value === "") {
        alert("you have empty field")
    } else {
        if (newPasswordField.value !== repeatNewPasswordField.value) {
            alert("passwords doesn't match")
        } else {
            if (oldPasswordField.value !== password) {
                alert("old password is incorrect")
            } else {
                let data = {
                    'new-password': siteAddressField.value,
                }
                let headers = {
                    'Content-Type': 'application/json',
                    'token': Cookies.get('auth')
                }
                password = newPasswordField.value;
                httpExcGET('POST', changePasswordUrl, data, successChangePassword, denyChangePassword, headers)
            }
        }
    }
}

function successChangePassword(value) {
    alert("password changed successfully" + "  value : " + JSON.stringify(value))
}

function denyChangePassword(value) {
    alert("password doesn't change" + "  value : " + JSON.stringify(value))
}
