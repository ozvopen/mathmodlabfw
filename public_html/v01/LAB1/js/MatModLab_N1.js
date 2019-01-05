var scriptInfo = {
    ver: '0.1.3',
    name: 'MatModLab_N1.js'
};
window.onload = function(event) {
    document.getElementById('refreshBtn').onclick = function(event) {
        preventDefaultEvent(event);
        MatModLab_N1.calculations();
        MatModLab_N1.out();
    };
    document.getElementById('scriptVer').innerHTML = scriptInfo.ver;
    var a = document.getElementById('frame1').a,
            b = document.getElementById('frame1').b,
            h = document.getElementById('frame1').h,
            delta_x = document.getElementById('frame1').delta_x,
            outputScr = document.getElementById('outputScr');

    MatModLab_N1.calculations = function() {
        for (curX = parseFloat(a.value), i = 0; curX <= parseFloat(b.value); curX = parseFloat(curX + parseFloat(h.value)), i++) {
            MatModLab_N1.y[i] = (Math.exp(-2 * curX) + Math.pow(curX, 2) - 1);
            MatModLab_N1.x[i] = curX;
            MatModLab_N1.DELTA_x[i] = (parseFloat(delta_x.value) * Math.abs(curX));
            MatModLab_N1.dy[i] = (-2 * Math.exp(-2 * curX) + 2 * curX);
            MatModLab_N1.DELTA_y[i] = MatModLab_N1.dy[i] * MatModLab_N1.DELTA_x[i];
            MatModLab_N1.delta_y[i] = MatModLab_N1.DELTA_y[i] / Math.abs(MatModLab_N1.y[i]);
            MatModLab_N1.stepsCount = i + 1;
        }
        ;
    };
    MatModLab_N1.out = function() {
        outputScr.value += ('-----Calculations started with initial conditions: a = ' + a.value + '; b = ' + b.value + '; h = ' + h.value + '; δx = ' + delta_x.value + '-----\n');
        for (i = 0; i <= MatModLab_N1.stepsCount - 1; i++) {
            outputScr.value += ('Step #' + i + ': [x = ' + MatModLab_N1.x[i].toFixed(2) + '; y = ' + MatModLab_N1.y[i].toFixed(5) + '; Δx = ' + MatModLab_N1.DELTA_x[i].toFixed(7) + '; Δy = ' + MatModLab_N1.DELTA_y[i].toFixed(7) + '; δy = ' + MatModLab_N1.delta_y[i].toFixed(7) + ';]\n');
        }
        outputScr.value += ('-----Calculations finished.' + '-----\n');
    };

    MatModLab_N1.calculations();
    MatModLab_N1.out();

};
var MatModLab_N1 = new Object();
MatModLab_N1.x = new Array();
MatModLab_N1.DELTA_x = new Array();
MatModLab_N1.y = new Array();
MatModLab_N1.dy = new Array();
MatModLab_N1.delta_y = new Array();
MatModLab_N1.DELTA_y = new Array();
MatModLab_N1.stepsCount = 0;

function preventDefaultEvent(event) {
    event = event || window.event;
    if (event.preventDefault) {  // если метод существует
        event.preventDefault();
    } else { // вариант IE<9:
        event.returnValue = false;
    }
}