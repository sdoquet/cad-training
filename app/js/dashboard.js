// import { getUsersSessionScore, userConnected } from "./user.js";
import { getUserConnected } from "./firebaseService.js";
import { signOutUser } from "./login.js";
console.log("rnia ~ userConnected", userConnected);

const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');




function initFunction() {

    signOutButton?.addEventListener('click', signOut);
    getUsersSessionScore();
    getUserConnected().then((user) => showSignButton(user))

}

const showSignButton = (user) => {
    console.log("rnia ~ showSignButton ~ userConnected.uuid", user.uid);
    if (user.uid !== 0) {
        signInButton?.classList.add("d-none");
        signOutButton?.classList.remove("d-none");
        signOutButton?.classList.add("d-block");
        alert("toto")

    }
    else {
        signOutButton?.classList.add("d-none");
        signInButton?.classList.remove("d-none");
        signInButton?.classList.add("d-block");
        alert('tata')
    }
};

const signOut = () => {
    signOutUser()
};

initFunction();
