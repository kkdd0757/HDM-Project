import axios from 'axios';
import timer from './timer';
import modals from './modal';

// import axios from 'axios';
// import speak from './speak';

// DOM Nodes
const $interviewCountCurrent = document.querySelector('.interview__count--current');
const $interviewCountTotal = document.querySelector('.interview__count--total');
const $interviewCamMain = document.querySelector('.interview__cam-main');
const $interviewTimer = document.querySelector('.interview__timer');
const $interviewButtonsRepeat = document.querySelector('.interview-buttons__repeat');
const $interviewButtonsSubmit = document.querySelector('.interview-buttons__submit');

const $modalOuter = document.querySelector('.modal-outer');
const $modalButton = document.querySelector('.modal__button');
const $modalCancle = document.querySelector('.cancle');

// state
const startTime = 180;
const stopTime = 20;
let currentInterview = 1;
const totalInterview = 3;

// async function
async function playVideo() {
  const videoStream = await navigator.mediaDevices.getUserMedia({
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720,
      },
    },
  });
  $interviewCamMain.srcObject = videoStream;
}
const getData = async curIndex => {
  const {
    data: { interviewList },
  } = await axios.get('/userInfo');
  const xmlData = `<speak>${interviewList[curIndex]}</speak>`;

  try {
    const { data } = await axios.post('https://kakaoi-newtone-openapi.kakao.com/v1/synthesize', xmlData, {
      headers: {
        'Content-Type': 'application/xml',
        Authorization: 'KakaoAK 94d7ab8868125fad5c255d42c430f62a',
      },
      responseType: 'arraybuffer',
    });

    const context = new AudioContext();
    context.decodeAudioData(data, buffer => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
    });
  } catch (e) {
    console.error(e.message);
  }
};
getData(currentInterview - 1);

// helper
const updateTimer = () => {
  $interviewButtonsRepeat.toggleAttribute('disabled', startTime - timer.getTime() > stopTime);
  $interviewTimer.textContent = timer.updateTime();
};

const displayModal = ({ type, title, describtion, cancle, button }) => {
  document.querySelector('.modal__title').textContent = title;
  document.querySelector('.modal__describtion').textContent = describtion;
  $modalButton.textContent = button;
  $modalButton.dataset.type = type;
  $modalButton.focus();

  $modalCancle.classList.toggle('hidden', !cancle);
  $modalOuter.classList.toggle('hidden');
};

const toggleModal = obj => {
  currentInterview === totalInterview ? displayModal(modals.result) : displayModal(obj);
};

// event binding
window.addEventListener('DOMContentLoaded', () => {
  $interviewCountCurrent.textContent = currentInterview;
  $interviewCountTotal.textContent = totalInterview;

  timer.setTime(startTime);
  timer.start(() => {
    if (timer.getTime() === 0) toggleModal(modals.timeout);
    updateTimer();
  }, 1000);

  playVideo();
});

// 다시 시작
$interviewButtonsRepeat.onclick = () => {
  timer.stop();
  displayModal(modals.repeat);
};

// 답변 제출
$interviewButtonsSubmit.onclick = () => toggleModal(modals.submit);

// 취소 버튼 클릭
$modalCancle.onclick = () => {
  timer.stop();
  timer.start(() => {
    if (timer.getTime() === 0) toggleModal(modals.timeout);
    updateTimer();
  }, 1000);

  $modalOuter.classList.toggle('hidden');
};

$modalButton.onclick = e => {
  const { type } = e.currentTarget.dataset;
  if (type === 'result') {
    window.location.replace('/report.html');
    return;
  }
  if (type === 'submit' || type === 'timeout') {
    currentInterview += 1;
    $interviewCountCurrent.textContent = currentInterview;
  }

  timer.stop();
  timer.setTime(startTime);
  timer.start(() => {
    if (timer.getTime() === 0) toggleModal(modals.timeout);
    updateTimer();
  }, 1000);

  $modalOuter.classList.toggle('hidden');
};
