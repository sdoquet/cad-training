import { signInWithCredential, getUserConnected, signOut, getDBRef } from "./firebaseService.js";

const loginForm = document.getElementById('loginForm');

function initFunction() {
    loginForm?.addEventListener('submit', signInUser);
}

const signInUser = (event) => {
    console.log("rnia ~ signInUser ~ event", event);
    if (loginForm) event.preventDefault();

    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    signInWithCredential(value.email, value.pwd).then(() => redirect());

    loginForm?.reset();
};

const redirect = () => {
    const userConnected = getUserConnected().then(user => {
        if (user.uid !== 0) {
            getDBRef(`users/${user.uid}/info/active`)
                .once('value')
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        if (snapshot.val() === true)
                        //     window.location.replace('/smart-spelling/session.html');
                        // else window.location.replace('/smart-spelling/trainning.html');
                            window.location.replace('/session.html');
                        else window.location.replace('/trainning.html');
                    }
                });

        }
    });
};

const signOutUser = () => {
    signOut();
};

export { signOutUser };

initFunction();
