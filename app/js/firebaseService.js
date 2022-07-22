// !IMPORTANT: REPLACE WITH YOUR OWN CONFIG OBJECT BELOW

// Initialize Firebase
// const config = {
//   apiKey: 'AIzaSyBOYgsOh-uGo0d9mKlfZyg_CalTRGh9eZU',
//   authDomain: 'jeremy-1f5ea.firebaseapp.com',
//   databaseURL: 'https://jeremy-1f5ea-default-rtdb.firebaseio.com',
//   projectId: 'jeremy-1f5ea',
//   storageBucket: 'jeremy-1f5ea.appspot.com',
//   messagingSenderId: '953622695651',
//   appId: '1:953622695651:web:401bf2ee69d5290fa97fd6',
// //   measurementId: 'G-89Y5YZGCVG',
// }
const config = {
	apiKey: 'AIzaSyAeAppdQ8mBRupdNeaQufltjhaqyEM1Oak',
	authDomain: 'cnd-sport.firebaseapp.com',
	databaseURL: 'https://cnd-sport.firebaseio.com',
	projectId: 'cnd-sport',
	storageBucket: 'cnd-sport.appspot.com',
	messagingSenderId: '850264334239',
	appId: '1:850264334239:web:dbffd9ccdd242d03e767aa',
};

firebase.initializeApp(config);

// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const auth = firebase.auth();


// --------------------------
// DATABASE
// --------------------------

function getDBRef(path) {
	return dbRef.child(path);
}


// --------------------------
// LOGIN
// --------------------------
async function getUserConnected() {
	const userConnected = {
		email: '',
		uid: 0,
		displayName: '',
	};
	return new Promise((resolve, reject) => {
		auth.onAuthStateChanged(user => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
				userConnected.displayName = user.displayName;
				userConnected.email = user.email;
				userConnected.uid = user.uid;
				console.log("rnia ~ auth.onAuthStateChanged FIREBASE~ userConnected", userConnected);
				resolve(userConnected)
			} else {
				// User is signed out
				userConnected.displayName = '';
				userConnected.email = '';
				userConnected.uid = 0;
				console.log('rnia ~ else .then ~ userConnected', userConnected);
				// window.location.href = '/smart-spelling'
				window.location.href = '/'
				// reject()
			}
		});
	})
}

async function signInWithCredential(email, password, rememberMe = false) {
	console.log('rnia ~ signInWithCredential ~ rememberMe', rememberMe);
	const persistence = rememberMe
	? firebase.auth.Auth.Persistence.LOCAL
	: firebase.auth.Auth.Persistence.SESSION;
    console.log("rnia ~ signInWithCredential ~ persistence", persistence);

	await auth.setPersistence(persistence);

	return (
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => {
				console.log('rnia ~ signInWithCredential ~ error', error);
				var errorCode = error.code;
				var errorMessage = error.message;
			})
	);
}

function signOut() {
	auth
		.signOut()
		.then(() => {
			// Sign-out successful.
		})
		.catch((error) => {
			// An error happened.
		});
}

export {getUserConnected, getDBRef, signInWithCredential, signOut };
