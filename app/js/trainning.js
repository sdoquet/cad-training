import { getUserConnectedData } from './user.js'
import { getUserConnected } from './firebaseService.js'
import { getDBRef } from './firebaseService.js'

const displayUsersRef = getDBRef('users')
const glossaryRef = getDBRef('glossary')

const timerElement = document.getElementById('timer')
const playerAnswer = document.getElementById('answer')
const playButton = document.getElementById('play')
const pauseButton = document.getElementById('pause')
const resetButton = document.getElementById('reset')
const repeatButton = document.getElementById('repeat')
const defineButton = document.getElementById('define')
const natureButton = document.getElementById('nature')
const originButton = document.getElementById('origin')
const contextButton = document.getElementById('context')
const repeatBadge = document.getElementById('repeatBadge')
const defineBadge = document.getElementById('defineBadge')
const kindBadge = document.getElementById('kindBadge')
const originBadge = document.getElementById('originBadge')
const contextBadge = document.getElementById('contextBadge')
const wordAnswerInput = document.getElementById('word')
const hiddenIndication = document.getElementById('indication')
const hiddenWordToSpell = document.getElementById('word-spelling')
const userScoreSpan = document.getElementById('user-score')
const indicationCountDown = {
  repeat: 3,
  define: 3,
  nature: 3,
  origin: 3,
  context: 3,
}

let wordInProgressJSON = {}
let RemainingWordJSON = {}
let intervalCountDown = null
let indicationTimeout = null
let initialRemainingTime = '00:01:00'
let remainingTime = initialRemainingTime

getUserConnected().then((user) => {
  getUserConnectedData(user.uid).then((data) => {
    initFunction(data)
  })
})

function initFunction(user) {
  console.log('rnia ~ initFunction ~ user', user)
  playButton?.addEventListener('click', startCountDown)
  resetButton?.addEventListener('click', resetCountDown)
  playerAnswer?.addEventListener('submit', handleAnswer)

  repeatBadge.textContent = indicationCountDown.repeat
  defineBadge.textContent = indicationCountDown.define
  kindBadge.textContent = indicationCountDown.nature
  originBadge.textContent = indicationCountDown.origin
  contextBadge.textContent = indicationCountDown.context

  userScoreSpan.textContent = user.info.scoreTotalTraining.toString()

  displayTime(getArrayTime(remainingTime))
  setWordByLevel('level-1')
}

const countDown = () => {
  // let dateNow = new Date();
  // let countDownDate = new Date().getTime();

  let timeArr = getArrayTime()
  let temps =
    parseInt(timeArr[0]) * 3600 +
    parseInt(timeArr[1]) * 60 +
    parseInt(timeArr[2])

  temps -= 1

  intervalCountDown = setInterval(() => {
    // let days = Math.floor(temps / ( 3600 * 24));
    let hours = Math.floor((temps % (3600 * 24)) / 3600)
    let minutes = Math.floor((temps % 3600) / 60)
    let secondes = Math.floor(temps % 60)

    displayTime([hours, minutes, secondes])

    if (temps <= 0) {
      temps = 0
      pauseCountDown()
    } else temps -= 1
  }, 1000)
}

const startCountDown = () => {
  let text = hiddenWordToSpell?.textContent
  let speech = new SpeechSynthesisUtterance(text)
  speech.lang = 'fr-FR'

  speech.onend = (event) => {
    countDown()
    playButton?.toggleAttribute('disabled') //removeEventListener('click', startCountDown);
    wordAnswerInput?.focus()
    // pauseButton?.addEventListener('click', pauseCountDown);
  }
  speechSynthesis.speak(speech)
  repeatButton?.addEventListener('click', repeatWold)
  defineButton?.addEventListener('click', defineIndication)
  natureButton?.addEventListener('click', natureIndication)
  originButton?.addEventListener('click', originIndication)
  contextButton?.addEventListener('click', contextIndication)
}

const pauseCountDown = () => {
  clearInterval(intervalCountDown)
  pauseButton?.removeEventListener('click', pauseCountDown)
  repeatButton?.removeEventListener('click', repeatWold)
  playButton?.addEventListener('click', startCountDown)
}

const handleAnswer = (event) => {
  if (playerAnswer) event.preventDefault()

  const data = new FormData(event.target)
  const value = Object.fromEntries(data.entries())

  let word = value.word.toString().toLowerCase()

  resetCountDown()
  // @ts-ignore
  if (word.localeCompare(hiddenWordToSpell.textContent.toLowerCase()) === 0) {
    console.log('rnia ~ handleAnswer ~ word', word)
    // setWordByLevel();
    playerAnswer?.reset()
    getNextWold()
    playButton?.toggleAttribute('disabled')
    // playButton?.click()
    userScoreSpan.textContent++
  } else {
    console.log('perdu')
    // pauseCountDown()
    playerAnswer?.reset()
    getNextWold()
    playButton?.toggleAttribute('disabled')
  }
}

const setIndicationButtonByCount = () => {
  repeatBadge.textContent = indicationCountDown.repeat.toString()
  defineBadge.textContent = indicationCountDown.define.toString()
  originBadge.textContent = indicationCountDown.origin.toString()
  kindBadge.textContent = indicationCountDown.nature.toString()
  contextBadge.textContent = indicationCountDown.context.toString()

  if (indicationCountDown.repeat <= 0)
    repeatButton?.setAttribute('disabled', '')
  else repeatButton?.removeAttribute('disabled')

  if (indicationCountDown.define <= 0)
    defineButton?.setAttribute('disabled', '')
  else defineButton?.removeAttribute('disabled')

  if (indicationCountDown.nature <= 0)
    natureButton?.setAttribute('disabled', '')
  else natureButton?.removeAttribute('disabled')

  if (indicationCountDown.origin <= 0)
    originButton?.setAttribute('disabled', '')
  else originButton?.removeAttribute('disabled')

  if (indicationCountDown.context <= 0)
    contextButton?.setAttribute('disabled', '')
  else contextButton?.removeAttribute('disabled')
}

const setAllIndicationDisabled = () => {
  repeatButton?.setAttribute('disabled', '')
  defineButton?.setAttribute('disabled', '')
  natureButton?.setAttribute('disabled', '')
  originButton?.setAttribute('disabled', '')
  contextButton?.setAttribute('disabled', '')
}

const setAllIndicationEnabled = () => {
  repeatButton?.removeAttribute('disabled')
  defineButton?.removeAttribute('disabled')
  natureButton?.removeAttribute('disabled')
  originButton?.removeAttribute('disabled')
  contextButton?.removeAttribute('disabled')
}

const repeatWold = () => {
  let word = hiddenWordToSpell?.textContent
  indicationCountDown.repeat--
  let speech = new SpeechSynthesisUtterance(word)

  speech.lang = 'fr-FR'
  setAllIndicationDisabled()
  speech.onend = (event) => {
    setIndicationButtonByCount()
  }
  speechSynthesis.speak(speech)
}

const defineIndication = () => {
  let word = hiddenWordToSpell?.textContent
  indicationCountDown.define--
  displayIndication(wordInProgressJSON[word]['definition'])
}

const natureIndication = () => {
  let word = hiddenWordToSpell?.textContent
  let nb = indicationCountDown.nature--
  displayIndication(wordInProgressJSON[word]['kind'])
  kindBadge.textContent = nb.toString()
}

const originIndication = () => {
  let word = hiddenWordToSpell?.textContent
  indicationCountDown.origin--
  displayIndication(wordInProgressJSON[word]['origin'])
}

const contextIndication = () => {
  let word = hiddenWordToSpell?.textContent
  indicationCountDown.context--
  displayIndication(wordInProgressJSON[word]['context'])
}

const getWordByKeyDB = async (key) => {
  let wordObject = {}
  await glossaryRef
    .child(key)
    .get()
    .then((snapshot) => {
      wordObject = snapshot.val()
    })
  return wordObject
}

const getNextWold = () => {
  let words = Object.keys(RemainingWordJSON)
  if (words.length > 0) {
    const random = Math.floor(Math.random() * words.length)
    if (hiddenWordToSpell) hiddenWordToSpell.textContent = words[random]
    wordInProgressJSON[words[random]] = RemainingWordJSON[words[random]]
    delete RemainingWordJSON[words[random]]

    repeatBadge.textContent = '3'
    defineBadge.textContent = '3'
    originBadge.textContent = '3'
    kindBadge.textContent = '3'
    contextBadge.textContent = '3'

    setAllIndicationEnabled()
  }
}

const setWordByLevel = (level) => {
  RemainingWordJSON = {}
  const worldRef = getDBRef('app/trainning/' + level)
  worldRef.get().then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val()
      data.forEach((element, key, arr) => {
        getWordByKeyDB(element).then((word) => {
          RemainingWordJSON[element] = word
          if (Object.is(arr.length - 1, key)) getNextWold()
        })
      })
    }
  })
}

const resetCountDown = () => {
  let timeArr = getArrayTime(initialRemainingTime)
  pauseCountDown()
  displayTime(timeArr)
}

const getArrayTime = (time) => {
  let timeArr = time
    ? time.split(':')
    : timerElement
    ? timerElement.textContent.split(':')
    : initialRemainingTime.split(':')

  return timeArr
}

const displayTime = (timeArr) => {
  let hours =
    parseInt(timeArr[0]) < 10 ? '0' + parseInt(timeArr[0]) : timeArr[0]
  let minutes =
    parseInt(timeArr[1]) < 10 ? '0' + parseInt(timeArr[1]) : timeArr[1]
  let secondes =
    parseInt(timeArr[2]) < 10 ? '0' + parseInt(timeArr[2]) : timeArr[2]

  if (timerElement) timerElement.textContent = `${hours}:${minutes}:${secondes}`
}

const displayIndication = (indStr = '') => {
  hiddenIndication.textContent = indStr
  wordAnswerInput?.focus()
  setAllIndicationDisabled()
  hiddenIndication?.classList.toggle('d-none')
  indicationTimeout = setTimeout(() => {
    hiddenIndication?.classList.toggle('d-none')
    setIndicationButtonByCount()
  }, 3000)
}
