import { getDBRef, getUserConnected } from "./firebaseService.js";

const usersRef = getDBRef('users');

const getUserConnectedData = uid => {
	let userDataRef = usersRef.child(uid);
	return new Promise((resolve, rejecct) => {
		userDataRef.on('value', snap => {
			if (snap.exists()) {
				let data = snap.val()
                console.log("rnia ~ returnnewPromise USER~ snap.val()", snap.val());
				resolve(data);
			} else {
				rejecct();
			}

		});
	});

};

export { getUserConnected, getUserConnectedData };