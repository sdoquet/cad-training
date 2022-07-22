import { getDBRef, getUserConnected , signOut} from './firebaseService.js';

const usersRef = getDBRef('users');
const timerElement = document.getElementById('timer');
const displayTimerRef = getDBRef('timer');
const formTimer = document.getElementById('setTimer');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

let play = false;
let intervalCountDown = null;
let initialRemainingTime = '00:01:00';
let remainingTime = initialRemainingTime;
let session = false;

getUserConnected().then(user => {
	if (user.uid !== 0) {
		initFunction()
	}
})

function initFunction() {
	getTimerDatabase()
	getUsersScore();

	playButton?.addEventListener('click', startCountDown);
	resetButton?.addEventListener('click', resetCountDown);
	formTimer?.addEventListener('submit', setCountDown);
}

const getTimerDatabase = () => {
	displayTimerRef.on('value', (snap) => {
		let value = snap.val();
		// console.log("rnia ~ displayTimerRef.on ~ value", value);
		// play = value.play;
		initialRemainingTime = value.initialRemainingTime;
		remainingTime = value.remainingTime;
		displayTime(getArrayTime(remainingTime));
	});
};

const getUsersScore = () => {
	usersRef.orderByChild('info/scoreTotalSession').on('value', (snap) => {
		const userScoreArray = [];

		snap.forEach((childSnap) => {
			let value = childSnap.val();
			console.log('rnia ~ snap.forEach ~ value', value);
			userScoreArray.push({
				name: value.info.displayName,
				value: value.info.scoreTotalSession,
			});
		});
		displayUsersScore(userScoreArray);
	});
};

const countDown = () => {
	// let dateNow = new Date();
	// let countDownDate = new Date().getTime();

	let timeArr = getArrayTime();
	let temps =
		parseInt(timeArr[0]) * 3600 +
		parseInt(timeArr[1]) * 60 +
		parseInt(timeArr[2]);

	temps -= 1;

	intervalCountDown = setInterval(() => {
		// let days = Math.floor(temps / ( 3600 * 24));
		let hours = Math.floor((temps % (3600 * 24)) / 3600);
		let minutes = Math.floor((temps % 3600) / 60);
		let secondes = Math.floor(temps % 60);

		displayTimerRef.update({
			play: true,
			remainingTime: `${hours}:${minutes}:${secondes}`,
		});

		if (temps <= 0) {
			temps = 0;
			pauseCountDown();
		} else temps -= 1;
	}, 1000);
};

const startCountDown = () => {
	play = true;
	countDown();
	playButton?.removeEventListener('click', startCountDown);
	pauseButton?.addEventListener('click', pauseCountDown);
};

const pauseCountDown = () => {
	play = false;
	clearInterval(intervalCountDown);
	displayTimerRef.update({ play: false });
	pauseButton?.removeEventListener('click', pauseCountDown);
	playButton?.addEventListener('click', startCountDown);
};

const setCountDown = (event) => {
	if (formTimer) event.preventDefault();

	const data = new FormData(event.target);
	const value = Object.fromEntries(data.entries());

	let hours = value.hr.toString();
	let minutes = value.mn.toString();
	let secondes = value.sec.toString();
	let time = `${hours}:${minutes}:${secondes}`;

	displayTimerRef.update({ initialRemainingTime: time, remainingTime: time });
	displayTime([hours, minutes, secondes]);
};

const resetCountDown = () => {
	let timeArr = getArrayTime(initialRemainingTime);

	pauseCountDown();
	displayTimerRef.update({
		remainingTime: `${timeArr[0]}:${timeArr[1]}:${timeArr[2]}`,
	});

	// displayTime(timeArr);
};

const getArrayTime = (time) => {
	let timeArr = time
		? time.split(':')
		: timerElement
			? timerElement.textContent.split(':')
			: initialRemainingTime.split(':');

	return timeArr;
};

const displayUsersScore = (scores = [], descending = true) => {
	// console.log("rnia ~ displayUsersScore ~ scores", scores);
	const usersScoreHTML = document.getElementById('user-score');
	let sortedArray = descending
		? scores.sort((a, b) => b.value - a.value)
		: scores;
	let userScoreRow = '';

	sortedArray.forEach((user) => {
		userScoreRow += ` <div class="list-group-item">
			<span class="fw-bolder fs-5">${user.name}</span>
			<div class="progress">
				<div class="progress-bar bg-success" role="progressbar" aria-valuenow="25" style="width:${user.value}%" aria-valuemin="0" aria-valuemax="100">${user.value}</div>
			</div>
		</div>`;
	});
	// console.log("rnia ~ sortedArray ~ sortedArray", sortedArray);
	usersScoreHTML ? (usersScoreHTML.innerHTML = userScoreRow) : null;
};

const displayTime = (timeArr) => {
	let hours =
		parseInt(timeArr[0]) < 10 ? '0' + parseInt(timeArr[0]) : timeArr[0];
	let minutes =
		parseInt(timeArr[1]) < 10 ? '0' + parseInt(timeArr[1]) : timeArr[1];
	let secondes =
		parseInt(timeArr[2]) < 10 ? '0' + parseInt(timeArr[2]) : timeArr[2];

	if (timerElement) timerElement.textContent = `${hours}:${minutes}:${secondes}`;
};
