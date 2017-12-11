main();

function main() {

    // =============== ( VARIABLES ) =============== //

    // input field variables
    var workingTime, shortBreakTime, longBreakTime, pomodoroes;
    // initial values variables
    var secondsRemaining, currentPomodoro, timerActive, total, activeInterval, j, pomodoroArray;

    // ----------------   D O M
    // ---------  formField DOM variables 
    var $work = document.getElementById('work');
    var $short = document.getElementById('short');
    var $long = document.getElementById('long');
    var $delay = document.getElementById('delay');
    var $clockField = document.getElementById('clockField');
    var $formField = document.getElementById('formField');
    var $settings = document.getElementById('settings');

    // ---------  clockField DOM variables
    var $submit = document.getElementById('submit');
    var $buttons = document.getElementsByClassName('action-buttons');
    var $start = document.getElementById('start');
    var $reset = document.getElementById('reset');
    var $pause = document.getElementById('pause');
    var $resume = document.getElementById('resume');
    var $done = document.getElementById('done');
    var $skip = document.getElementById('skip');
    // Clock elements
    var $clock = document.getElementById('clock');
    var $minutes = document.getElementById('minutes');
    var $seconds = document.getElementById('seconds');
    var $message = document.getElementById('message');

    // loading the alarm audio
    // var alarm = new Audio('../audio/Marimba-logo.mp3');

    submitFormValues();
    initialState();
    render();

    // =============== ( FUNCTIONS ) =============== //

    function generatingPomodoroArray(cycles) {
        var arr = [];
        for(var i=0; i<pomodoroes*2 - 1; i++) {
            if(i % 2 === 0) {
                arr.push(workingTime);
            } else if(i % 2 === 1) {
                arr.push(shortBreakTime);
            }
        }
        arr.push(longBreakTime);
        return arr;
    }
    function getTimeRemaining(totalSec) {
        var seconds = totalSec % 60;
        var minutes = Math.floor(totalSec / 60) % 60;
        return {
            minutes: minutes,
            seconds: seconds
        }
    }
    function hideAllActionButtons() {
        for (var i=0; i<$buttons.length; i++) {
            $buttons[i].classList.add('btn-hide');
        }
    }
    function initialState() {
        secondsRemaining = workingTime * 60;
        currentPomodoro = 1; // first cycle
        timerActive = false; // this means the clock is not running
        j = 0; // initial cycle index
        pomodoroArray = generatingPomodoroArray(pomodoroes);
        updateScreen();
    }
    function submitFormValues() {
        workingTime = $work.value;
        shortBreakTime = $short.value;
        longBreakTime = $long.value;
        pomodoroes = $delay.value;
    }
    function updateScreen() {
        if (j % 2 === 0) {
            $clock.style.color = '#FC4349';
            $message.innerText = 'Working Time #' + (j/2 + 1);
            hideAllActionButtons();
            $start.classList.remove('btn-hide');
            $reset.classList.remove('btn-hide');
            $reset.disabled = true;
        } else if (j % 2 === 1 && j !== pomodoroArray.length - 1){
            $clock.style.color = '#6DBCDB';
            $message.innerText = 'Short Break Time';
            hideAllActionButtons();
            $start.classList.remove('btn-hide');
            $skip.classList.remove('btn-hide');
        } else {
            $clock.style.color = '#D7DADB';
            $message.innerText = 'Long Break Time';
            hideAllActionButtons();
            $start.classList.remove('btn-hide');
            $skip.classList.remove('btn-hide');
        }
    }
    function updateClock() {
        total = getTimeRemaining(secondsRemaining);
        $minutes.innerText = ('0' + total.minutes).slice(-2);
        $seconds.innerText = ('0' + total.seconds).slice(-2);
        if(timerActive) {
            if(secondsRemaining === 0) {
                clearInterval(activeInterval);
                alarm.play();
                timerActive = false;
                j++;
                if(j < pomodoroArray.length) {
                    var nextTime = pomodoroArray[j];
                    secondsRemaining = nextTime * 60;
                }
                else if(j = pomodoroArray.length) {
                    j = 0;
                    var nextTime = pomodoroArray[j];
                    secondsRemaining = nextTime * 60;
                }
                updateScreen();
                render();
            }
            secondsRemaining--;
        }
    }
    function render() {
        updateClock();
        if(timerActive) {
            activeInterval = setInterval(updateClock, 1000);
        } 
    }
    
    // =============== ( EVENT LISTENERS ) =============== //
    
    $submit.addEventListener('click', function() {
        submitFormValues();
        initialState();
        render();
        $clockField.classList.remove('hide');
        $formField.classList.add('hide');
    });
    $settings.addEventListener('click', function() {
        clearInterval(activeInterval);
        $clockField.classList.add('hide');
        $formField.classList.remove('hide');
    });

    // ACTION BUTTONS EVENT LISTENERS
    $done.addEventListener('click', function(){
        clearInterval(activeInterval);
        timerActive = false;
        j++;
        updateScreen();
        if(j < pomodoroArray.length) {
            var nextTime = pomodoroArray[j];
            secondsRemaining = nextTime * 60;
        }
        else if(j = pomodoroArray.length) {
            j = 0;
            var nextTime = pomodoroArray[j];
            secondsRemaining = nextTime * 60;
        }
        render();
    });
    $pause.addEventListener('click', function(){
        clearInterval(activeInterval);
        timerActive = false;
        secondsRemaining = secondsRemaining + 1;
        hideAllActionButtons();
        if(j % 2 === 0) {
            $resume.classList.remove('btn-hide');
            $done.classList.remove('btn-hide');
        } else {
            $resume.classList.remove('btn-hide');
            $skip.classList.remove('btn-hide');
        }
        render();
    });
    $reset.addEventListener('click', function(){
        clearInterval(activeInterval);
        timerActive = false;
        var nextTime = pomodoroArray[j];
        secondsRemaining = nextTime * 60;
        updateScreen();
        render();
    });
    $resume.addEventListener('click', function(){
        timerActive = true;
        hideAllActionButtons();
        if(j % 2 === 0) {
            $pause.classList.remove('btn-hide');
            $reset.classList.remove('btn-hide');
        } else {
            $pause.classList.remove('btn-hide');
            $skip.classList.remove('btn-hide');
        }
        render();
    });
    $skip.addEventListener('click', function(){
        clearInterval(activeInterval);
        timerActive = false;
        j++;
        updateScreen();
        if(j < pomodoroArray.length) {
            var nextTime = pomodoroArray[j];
            secondsRemaining = nextTime * 60;
        }
        else if(j = pomodoroArray.length) {
            j = 0;
            var nextTime = pomodoroArray[j];
            secondsRemaining = nextTime * 60;
            updateScreen();
        }
        render();
    });
    $start.addEventListener('click', function(){
        timerActive = true;
        hideAllActionButtons();
        if (j % 2 === 0) {
            $pause.classList.remove('btn-hide');
            $reset.classList.remove('btn-hide');
            $reset.disabled = false;
        } else {
            $pause.classList.remove('btn-hide');
            $skip.classList.remove('btn-hide');
        }
        render();
    });
}
