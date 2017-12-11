main();
function main() {
    // defining variables for getting input field values
    var workingTime, shortBreakTime, longBreakTime, pomodoroes;

    // caching all DOM elements
    
    var $work = document.getElementById('work');
    var $short = document.getElementById('short');
    var $long = document.getElementById('long');
    var $delay = document.getElementById('delay');

    var $clockField = document.getElementById('clockField');
    var $settingsField = document.getElementById('settingsField');

    // caching Button elements
    var $submit = document.getElementById('submit');
    var $buttons = document.getElementById('buttons').querySelectorAll('button');
    var $start = document.getElementById('start');
    var $reset = document.getElementById('reset');
    var $pause = document.getElementById('pause');
    var $resume = document.getElementById('resume');
    var $done = document.getElementById('done');
    var $skip = document.getElementById('skip');
    var $settings = document.getElementById('settings');

    // caching Clock elements
    var $clock = document.getElementById('clock');
    var $minutes = document.getElementById('minutes');
    var $seconds = document.getElementById('seconds');
    var $message = document.getElementById('message');

    
    function inputValues() {
        workingTime = $work.value;
        shortBreakTime = $short.value;
        longBreakTime = $long.value;
        pomodoroes = $delay.value;
        clockFunction();
    }

    inputValues();

    $submit.addEventListener('click', function() {
        inputValues();
        $clockField.classList.remove('hide');
        $settingsField.classList.add('hide');
        console.log('submit');
    });

    function clockFunction() {

        $settings.addEventListener('click', function() {
            clearInterval(activeInterval);
            $clockField.classList.add('hide');
            $settingsField.classList.remove('hide');
            console.log('settings');
        });

        // loading the alarm audio
        var alarm = new Audio('../audio/Marimba-logo.mp3');

        // Initial values
        var secondsRemaining = workingTime * 60;
        var currentPomodoro = 1; // first cycle
        var timerActive = false; // this means the clock is not running
        var total; // returns object with mins and secs left
        var activeInterval; // needed to clearInterval at some time
        var j = 0; // initial cycle index
        hideButtons(); // hiding all the buttons
        $start.classList.remove('btn-hide'); // showing just these two buttons
        $reset.classList.remove('btn-hide');
        $reset.disabled = true;
        
        var pomodoroArray = generatingPomodoroArray(pomodoroes);
        clockTextColor();

        // ----------- F U N C T I O N S

        // generating cycles pattern
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

        // generating text color of clock element
        // ovde implementirati dugmice !!!
        function clockTextColor() {
            if (j % 2 === 0) {
                $clock.style.color = '#FC4349';
                $message.innerText = 'Working Time #' + (j/2 + 1);
                hideButtons();
                $start.classList.remove('btn-hide');
                $reset.classList.remove('btn-hide');
                $reset.disabled = true;

            } else if (j % 2 === 1 && j !== pomodoroArray.length - 1){
                $clock.style.color = '#6DBCDB';
                $message.innerText = 'Short Break Time';
                hideButtons();
                $start.classList.remove('btn-hide');
                $skip.classList.remove('btn-hide');

            } else {
                $clock.style.color = '#D7DADB';
                $message.innerText = 'Long Break Time';
                hideButtons();
                $start.classList.remove('btn-hide');
                $skip.classList.remove('btn-hide');
            }
        }

        // hide all buttons
        function hideButtons() {
            for (var i=0; i<$buttons.length; i++) {
                $buttons[i].classList.add('btn-hide');
            }
        }

        // generation remaining minutes + seconds
        function getTimeRemaining(totalSec) {
            var seconds = totalSec % 60;
            var minutes = Math.floor(totalSec / 60) % 60;
            return {
                minutes: minutes,
                seconds: seconds
            }
        }

        // render function - main function
        function render() {
            // clockTextColor();
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
                            render();
                        }
                        else if(j = pomodoroArray.length) {
                            j = 0;
                            var nextTime = pomodoroArray[j];
                            secondsRemaining = nextTime * 60;
                            render();
                        } 
                        clockTextColor();
                    }
                    secondsRemaining--;
                    
                }
            }
            updateClock();
            if(timerActive) {
                activeInterval = setInterval(updateClock, 1000);
            }
        }

        render();

        // Click event handlers

        $start.addEventListener('click', function(){
            timerActive = true;
            hideButtons();
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

        $reset.addEventListener('click', function(){
            clearInterval(activeInterval);
            timerActive = false;
            var nextTime = pomodoroArray[j];
            secondsRemaining = nextTime * 60;
            hideButtons();
            $start.classList.remove('btn-hide');
            $reset.classList.remove('btn-hide');
            $reset.disabled = true;
            render();
        });

        $pause.addEventListener('click', function(){
            clearInterval(activeInterval);
            timerActive = false;
            secondsRemaining = secondsRemaining + 1;
            hideButtons();
            if(j % 2 === 0) {
                $resume.classList.remove('btn-hide');
                $done.classList.remove('btn-hide');
            } else {
                $resume.classList.remove('btn-hide');
                $skip.classList.remove('btn-hide');
            }
            render();
        });

        $resume.addEventListener('click', function(){
            timerActive = true;
            hideButtons();
            if(j % 2 === 0) {
                $pause.classList.remove('btn-hide');
                $reset.classList.remove('btn-hide');
            } else {
                $pause.classList.remove('btn-hide');
                $skip.classList.remove('btn-hide');
            }
            render();
        });

        $done.addEventListener('click', function(){
            clearInterval(activeInterval);
            timerActive = false;
            j++;
            clockTextColor();
            if(j < pomodoroArray.length) {
                var nextTime = pomodoroArray[j];
                secondsRemaining = nextTime * 60;
                render();
            }
            else if(j = pomodoroArray.length) {
                j = 0;
                var nextTime = pomodoroArray[j];
                secondsRemaining = nextTime * 60;
                render();
            }
        });

        $skip.addEventListener('click', function(){
            clearInterval(activeInterval);
            timerActive = false;
            j++;
            
            if(j < pomodoroArray.length) {
                var nextTime = pomodoroArray[j];
                secondsRemaining = nextTime * 60;
                render();
            }
            else if(j = pomodoroArray.length) {
                j = 0;
                var nextTime = pomodoroArray[j];
                secondsRemaining = nextTime * 60;
                render();
            }
            clockTextColor();
        });
    }  
}