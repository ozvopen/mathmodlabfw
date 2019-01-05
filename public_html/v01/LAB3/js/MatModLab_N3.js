var scriptInfo = {
    ver: '0.1.0',
    name: 'MatModLab_N3.js'
};
var MatModLab = new Object();
MatModLab.itersCount;
MatModLab.approx_x = null;
MatModLab.scope = 200;
MatModLab.calcTimeMs;
MatModLab.step;
MatModLab.m;
MatModLab.x = [], MatModLab.a = [], MatModLab.b = [];

MatModLab.funcDeriv0 = function (arg) {
    return parseFloat(2 * Math.exp(-arg * arg) - 3 * arg + 4);
};
MatModLab.funcDeriv1 = function (arg) {
    return parseFloat(-4 * Math.exp(-arg * arg) * arg - 3);
};
MatModLab.funcDeriv2 = function (arg) {
    return parseFloat(Math.exp(-arg * arg) * (8 * (arg * arg) - 4));
};
MatModLab.init = function () {
    document.getElementById('refreshBtn').onclick = function (event) {
        preventDefaultEvent(event);
        MatModLab.execute();
        MatModLab.out();
    };
    docAccuracyInput = document.getElementById('frame1').accuracy;
    outputScr = document.getElementById('outputScr');
    document.getElementById('scriptVer').innerHTML = scriptInfo.ver;
};
MatModLab.evalMethods = {
    approx: function () {
        MatModLab.itersCount = 0;
        MatModLab.approx_x = 0;
        MatModLab.resultAchieved = false;
        MatModLab.step = parseFloat(docAccuracyInput.value);
        while (!MatModLab.resultAchieved) {
            //console.log('MatModLab.calcs(): current step === ' + MatModLab.itersCount);
            MatModLab.itersCount++;
            MatModLab.approx_x += MatModLab.step;
            if ((MatModLab.funcDeriv0(MatModLab.approx_x) * MatModLab.funcDeriv0(-MatModLab.approx_x) < 0)
                    && (MatModLab.funcDeriv1(MatModLab.approx_x) * MatModLab.funcDeriv1(-MatModLab.approx_x) > 0)
                    && (MatModLab.funcDeriv2(MatModLab.approx_x) * MatModLab.funcDeriv2(-MatModLab.approx_x) > 0)
                    ) {
                MatModLab.resultAchieved = true;
                //console.log('MatModLab.calcs(): found value MatModLab.approx_x === ' + MatModLab.approx_x + '; ' + 'interval: [' + (-MatModLab.approx_x) + ';' + MatModLab.approx_x + ']');
            }
            ;
            //Calcs restriction
            if (MatModLab.itersCount > MatModLab.scope) {
                throw new Error('MatModLab.eval(): reached maximum number of iterations (' + MatModLab.scope + ') with no result (too much precision?)');
                break;
            }
            ;
        }
        ;
    }
    ,
    combined: function () {
        MatModLab.a[0] = MatModLab.approx_x;
        MatModLab.b[0] = -MatModLab.approx_x;
        for (i = 1; i <= MatModLab.itersCount; i++) {
            MatModLab.a[i] = MatModLab.a[i - 1] - MatModLab.funcDeriv0(MatModLab.a[i - 1]) / MatModLab.funcDeriv1(MatModLab.a[i - 1]);
            //console.log('MatModLab.evalMethods.combined(): MatModLab.a[' + i + '] === ' + MatModLab.a[i]);
            MatModLab.b[i] = MatModLab.b[i - 1] - (MatModLab.funcDeriv0(MatModLab.b[i - 1]) * (MatModLab.b[i - 1] - MatModLab.a[0]) / (MatModLab.funcDeriv0(MatModLab.b[i - 1]) - MatModLab.funcDeriv0(MatModLab.a[0])));
            //console.log('MatModLab.evalMethods.combined(): MatModLab.b[' + i + '] === ' + MatModLab.b[i]);
        }
        ;
    },
    simpleIters: function () {
        MatModLab.m = (-2 / MatModLab.funcDeriv1(MatModLab.approx_x));
        //console.log('MatModLab.calcs(): MatModLab.m === ' + MatModLab.m);
        MatModLab.x[0] = MatModLab.approx_x;
        for (i = 1; i < MatModLab.itersCount; i++) {
            MatModLab.x[i] = MatModLab.x[i - 1] + MatModLab.m * MatModLab.funcDeriv0(MatModLab.x[i - 1]);
            //console.log('MatModLab.x[' + i + '] === ' + MatModLab.x[i]);
        }
        ;
    }
};
MatModLab.execute = function () {
    timeBegin = window.performance.now();
    MatModLab.evalMethods.approx();
    MatModLab.evalMethods.combined();
    MatModLab.evalMethods.simpleIters();
    timeEnd = window.performance.now();
    MatModLab.calcTimeMs = timeEnd - timeBegin;
};
MatModLab.out = function () {
    outputScr.value += ('Calculations with precision ' + MatModLab.step + '\n');
    //Відокремлнеий корінь
    outputScr.value += ('Found approximate value x ~ ' + MatModLab.approx_x + ' on ' + MatModLab.itersCount + ' step , interval set [' + MatModLab.approx_x + ';' + (-MatModLab.approx_x) + ']\n');
    //Комбінований метод
    outputScr.value += ('Combined method:\n');
    for (i = 0; i < MatModLab.itersCount; i++)
        outputScr.value += ('a[' + i + '] === ' + MatModLab.a[i] + '\n');
    for (i = 0; i < MatModLab.itersCount; i++)
        outputScr.value += ('b[' + i + '] === ' + MatModLab.b[i] + '\n');
    //Метод простих ітерацій
    outputScr.value += ('Simple iterations:\n');
    outputScr.value += ('m = ' + MatModLab.m + '\n');
    for (i = 0; i < MatModLab.itersCount; i++)
        outputScr.value += ('x[' + i + '] === ' + MatModLab.x[i] + '\n');
    outputScr.value += ('-----------------------' + 'time elapsed: ' + MatModLab.calcTimeMs.toFixed(2) + ' ms------------------------\n\n');

};
function preventDefaultEvent(event) {
    event = event || window.event;
    if (event.preventDefault) {  // если метод существует
        event.preventDefault();
    } else { // вариант IE<9:
        event.returnValue = false;
    }
}
//On window load
window.onload = function () {
    MatModLab.init();
    MatModLab.execute();
    MatModLab.out();
};