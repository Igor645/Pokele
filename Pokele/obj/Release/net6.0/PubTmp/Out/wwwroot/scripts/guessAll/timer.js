const timerElement = document.querySelector('.timer');
let seconds = 0;
let minutes = 0;
let hours = 0;

function formatTime(time) {
  return time < 10 ? `0${time}` : time.toString();
}

function updateTimer() {
  seconds++;
  if (seconds === 60) {
    seconds = 0;
    minutes++;
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }
  }

  const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  timerElement.textContent = `Time: ${formattedTime}`;
  if(sessionStorage.getItem("isLoggedIn")){
    setTimeSoFar(sessionStorage.getItem('userId'), formattedTime);
  }
}

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

async function initializeTimer() {
  try {
    const userId = sessionStorage.getItem('userId');
      const response = await fetch(`http://noobtriestowin-001-site1.ctempurl.com/api/User/${userId}/GetTimeSoFar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error getting timeSoFar: ${errorMessage}`);
    }

    const timeSoFar = await response.text();

    const [hours, minutes, seconds] = timeSoFar.split(':').map(Number);
    setInitialTimer(hours, minutes, seconds);
  } catch (error) {
    console.error('Error:', error);
  }
}

function setInitialTimer(initialHours, initialMinutes, initialSeconds) {
  hours = initialHours;
  minutes = initialMinutes;
  seconds = initialSeconds;
  updateTimer();
}


function stopTimer() {
  clearInterval(timerInterval);
  
  const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  
  const recordTimeDto = {
    Generation: gen,
    NewTime: formattedTime
  };
  
  console.log(recordTimeDto)
  
  const userId = sessionStorage.getItem('userId');
  
    fetch(`http://noobtriestowin-001-site1.ctempurl.com/api/User/${userId}/ChangeRecordTime`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recordTimeDto)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}

const setTimeSoFar = async (userId, time) => {
  try {
      const response = await fetch(`http://noobtriestowin-001-site1.ctempurl.com/api/User/${userId}/SetTimeSoFar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Time: time }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error setting timeSoFar: ${errorMessage}`);
    }

    const updatedUserData = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

if(modeId == "continue"){
  initializeTimer();
}
startTimer();