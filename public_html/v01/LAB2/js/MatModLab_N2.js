var scriptInfo = {
    ver: '0.1.2',
    name: 'MatModLab_N2.js'
};
window.onload = function(event) {
    document.getElementById('refreshBtn').onclick = function(event) {
        preventDefaultEvent(event);
        MatModLab.calculations();
        MatModLab.out();
    };
    document.getElementById('scriptVer').innerHTML = scriptInfo.ver;
    MatModLab.X_n = document.getElementById('frame1').X_n,
            MatModLab.X_k = document.getElementById('frame1').X_k,
            MatModLab.DELTA_X = document.getElementById('frame1').DELTA_X,
            outputScr = document.getElementById('outputScr');

    MatModLab.calculations = function() {
        timeBegin = window.performance.now();
        for (MatModLab.stepsCount = 0, x = parseFloat(MatModLab.X_n.value); x <= parseFloat(MatModLab.X_k.value); x += parseFloat(MatModLab.DELTA_X.value)) {
            MatModLab.x[MatModLab.stepsCount] = x;
            MatModLab.y[MatModLab.stepsCount] = (((((x + 0) * x + 0) * x - 4) * x + 2) * x - 4) * x + 5;
            MatModLab.stepsCount++;
        }
        timeEnd = window.performance.now();
        MatModLab.calcTime = timeEnd - timeBegin;
    };
    MatModLab.out = function() {
        outputScr.value += ('-----Calculations started with initial conditions: X_n = ' + MatModLab.X_n.value + '; X_k = ' + MatModLab.X_k.value + '; ∆X = ' + MatModLab.DELTA_X.value + '-----\n');
        for (i = 0; i <= MatModLab.stepsCount - 1; i++) {
            outputScr.value += ('Step #' + i + ': [x = ' + MatModLab.x[i].toFixed(5) + '; y = ' + MatModLab.y[i].toFixed(5) + ';]\n');
        }
        outputScr.value += ('-----Calculations finished. Calculationtime: ' + MatModLab.calcTime.toFixed(2) + 'ms' + '-----\n');
    };
    MatModLab.calculations();
    MatModLab.out();
};
var MatModLab = new Object();
MatModLab.y = new Array();
MatModLab.stepsCount;
MatModLab.x = [];
MatModLab.calcTimeMs;
function preventDefaultEvent(event) {
    event = event || window.event;
    if (event.preventDefault) {  // если метод существует
        event.preventDefault();
    } else { // вариант IE<9:
        event.returnValue = false;
    }
}