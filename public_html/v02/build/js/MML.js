/**
 * MML.js: MatModLab framework engine
 * Uses namespace "MatModLab" and "MML"
 */
MML = MatModLab = {
    NAME: 'MatModLab Framework engine',
    VERSION: '0.2.2.01 test',
    const: {
        HTML_struct: {
            lab_switch: {
                id: 'Labselection_Labswitch',
                nodeName: 'select'
            },
            InputForm_spot: {
                id: 'MML_InputForm_spot',
                nodeName: 'div',
                input_form: {
                    id: 'MML_InputForm',
                    className: 'input-form',
                    nodeName: 'form',
                    userInput: {
                        id: 'MML_InputForm_UserInput',
                        className: 'user-input',
                        nodeName: 'section',
                        PlayBtn: {
                            id: 'MML_InputForm_UserInput_PlayBtn',
                            className: 'play-btn',
                            nodeName: 'input',
                            type: 'text'
                        }
                    },
                    helping_script: {
                        id: 'MML_InputForm_HelpingScript',
                        type: 'text/javascript',
                        nodeName: 'script'
                    }
                }
            },
            OutputForm: {
                id: 'MML_OutputForm',
                nodeName: 'form',
                screen: {
                    id: 'MML_OutputForm_Screen',
                    nodeName: 'textarea'
                }
            },
            header: {
                title: {
                    text: 'OZV MatModLab Framework'
                }
            },
            footer: {
                id: 'footer_text',
                engine_script_version: {
                    id: 'MML_engine_script_version',
                    nodeName: 'span',
                    description: 'Engine script version'
                },
                currentModule_version: {
                    id: 'MML_currentModule_version',
                    nodeName: 'span',
                    description: 'Currently loaded module version'
                },
                nodeName: 'footer'
            },
            verinfo: {
                className: 'verinfo'
            }
        },
        input_modules: {
            path: 'input_forms/',
            fileExtention: '.htm'
        },
        GET_param_names: {
            preload_lab: 'preload_lab'
        },
        new_line_marker: '\n',
        msg: {
            long_calculations: 'Calculations may take some time. Would you like to continue anyway?'
        }
    },
    lib: {
        clearHTMLElement: function (HTMLElement) {
            while (HTMLElement.firstChild) {
                HTMLElement.removeChild(HTMLElement.firstChild);
            }
        },
        removeHTMLElement: function (HTMLElement) {
            if (HTMLElement.remove)
                HTMLElement.remove();
            else
            if (HTMLElement.parentNode.removeChild)
                HTMLElement.parentNode.removeChild(HTMLElement);
            else
                throw new Error('MML.lib.removeHTMLElement(): can_t use any known method');
        },
        readTextFile: function (file) {
            var rawFile = new XMLHttpRequest(),
                    rawFileText;
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function ()
            {
                if (rawFile.readyState === 4)
                {
                    if (rawFile.status === 200 || rawFile.status == 0)
                    {
                        rawFileText = rawFile.responseText;
                    }
                }
            };
            rawFile.send(null);
            return (rawFileText);
        },
        load_module: function (module_number) {
            var target = MML.modules[module_number - 1];
            if (!target)
            {
                // Clear previous loaded module if present
                if (MML.res.InputForm.self)
                {
                    MML.lib.removeHTMLElement(MML.InputForm);
                    MML.InputForm = MML.res.InputForm.self = null;
                }
                if (module_number === 0)
                {
                    MML.log('Select lab', true);
                    return 0;
                }
                throw new Error('MML.lib.load_module(): Requested module not found');
                return 1;
            }

            //Load (from external file) form into placeholder & assign it to MML.res.InputForm
            MML.res.InputForm.spot.innerHTML = MML.lib.readTextFile(MML.const.input_modules.path + module_number + MML.const.input_modules.fileExtention);
            //Assign loaded form to MML variable
            MML.InputForm = MML.res.InputForm.self = document.getElementById(MML.const.HTML_struct.InputForm_spot.input_form.id);
            //Check if special managing script attached
            MML.InputForm.HelpingScript = MML.res.InputForm.internal_managing_script = document.getElementById(MML.const.HTML_struct.InputForm_spot.input_form.helping_script.id);
            if (MML.InputForm.HelpingScript)
                eval(MML.InputForm.HelpingScript.innerHTML);
            //This is what function do
            //
            set_input_form_titles();
            
            append_lab_switching();
            if (!MML.res.switchHeadingValueRemoved)
                remove_switch_heading();
            print_header();
            attach_unmeric_input_checking();
            init_play_button_click();
            unlock_play_button();
            //Functions definitions
            function attach_unmeric_input_checking() {
                var tmp = MML.InputForm.getElementsByClassName('numeric');
                for (var i = 0; i < tmp.length; i++)
                    tmp[i].onchange = function ()
                    {
                        this.value = MML.lib.parseFloat(this.value);
                    };
            }
            function print_header() {
                MML.log('Loaded ' + target.TYPE + ' №' + target.ID + '. Version: ' + target.VERSION + '. Description: ' + target.INFO_NZ.DESCRIPTION + '. Title: ' + target.INFO_NZ.TITLE);
                MML.log('Fill inputs with required values and click "Play" button to start calculations', true);
            }
            function init_play_button_click() {
                MML.InputForm.PlayBtn.onclick = function (event) {
                    MML.lib.preventDefaultEvent(event);
                    run();
                };
            }
            function unlock_play_button() {
                MML.InputForm.PlayBtn.removeAttribute('disabled');
            }
            function run() {
                MML.log(target.call(MML.InputForm), true, true);
            }
            function set_input_form_titles() {
                document.getElementById('MML_InputForm_Heading_Header_Text').innerHTML = target.INFO_NZ.TITLE;
                document.getElementById('MML_InputForm_Heading_Statement_Text').innerHTML = 'Statement';
                document.getElementById('MML_InputForm_UserInput_Header_Text').innerHTML = 'Required paramenters';
                document.getElementById('MML_OutputForm_header_Text').innerHTML = 'Calculations log';
            }
            function append_lab_switching() {
                var heading = document.getElementById('MML_InputForm_Heading_Header')
                MML.lib.clearHTMLElement(heading);
                heading.appendChild(MML.res.lab_switch);
            }
            function remove_switch_heading() {
                if (MML.res.switchHeadingValueRemoved != undefined) {
                    MML.res.lab_switch.remove(MML.res.lab_switch.item[0]);
                    MML.res.switchHeadingValueRemoved = true;
                }

            }
        },
        preventDefaultEvent: function (event) {
            event = event || window.event;
            if (event.preventDefault)
            {  // if method exists
                event.preventDefault();
            } else
            { // for IE<9:
                event.returnValue = false;
            }
        },
        getParameterByName: function (name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                    results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },
        log: function (string, pass_line, skip_finishing_dot) {
            var output = MML.OutputForm.screen;
            //If called without arguments, it means to pass a line
            if (!arguments && output.textContent) {
                newLine(output.textContent);
                return;
            }

            //Write main string
            write(output, string);
            //Skipping finishing dot if prompted or writing it sa default
            if (!skip_finishing_dot)
                write(output, '.');
            //If prompted to pass an extra line
            if (pass_line)
                addWhiteLineSpace(output, 2);
            //Else passing one line as default
            else
                addWhiteLineSpace(output, 1);
            //If JS error occures, dublicate it`s content to MML output
            window.onerror = function (errorMsg) {
                write(output, errorMsg);
                addWhiteLineSpace(output, 2);
            };
            function addWhiteLineSpace(textarea, count) {
                write(textarea, MML.const.new_line_marker);
                if ((count >= 2) && (count <= 10))
                {
                    //As the one line is allready passed
                    count--;
                    //Passing line reminding times
                    while (count >= 1)
                    {
                        count--;
                        write(MML.OutputForm.screen, MML.const.new_line_marker);
                    }
                }
                return 1;
            }
            function write(textarea, string) {
                textarea.textContent += string;
                return 1;
            }
            return 1;
        },
        check_preload_request: function () {
            var requested_lab_num = parseInt(MML.lib.getParameterByName(MML.const.GET_param_names.preload_lab));
            if (requested_lab_num)
            {
                MML.lib.load_module(requested_lab_num);
                MML.res.lab_switch.value = requested_lab_num;
            }
        },
        parseFloat: function (string) {
            var result = parseFloat(string.replace(/[^\d.-]/g, ''));
            if (isNaN(result))
                return 0;
            else
                return result;
        },
        VerinfoHTMLElem: function () {
            //Returns HTML elenent with script version information
            var elem = document.createElement(MML.const.HTML_struct.footer.engine_script_version.nodeName);
            elem.id = MML.const.HTML_struct.footer.engine_script_version.id;
            elem.innerHTML = ('. ' + MML.const.HTML_struct.footer.engine_script_version.description + ': ' + MML.VERSION + '.');
            return elem;
        }
    },
    modules: [
        {
            TYPE: 'MatModLab Framework engine module',
            ID: 1,
            VERSION: '2.1.1',
            /* "to be reviewed later" START */
            INFO_NZ: {
                LOCALE: 'NZ',
                LANG: 'EN',
                TITLE: 'Solving elementary function with defined precision',
                DESCRIPTION: 'Has internally implemented function solving script. Takes presicion argument'
            },
            /* END of "to be reviewed later" */

            call: function (user_input_form) {
                var a = 0,
                        b = 0,
                        h = 0,
                        curX = 0,
                        x = [],
                        y = [],
                        DELTA_x = [],
                        DELTA_y = [],
                        dy = [],
                        delta_x = 0,
                        delta_y = [],
                        /* stepsCount = 0,*/
                        i = 0;
                var longComput,
                        calculationsConfirmed = false,
                        calcTimeMs = 0,
                        calculations_performed = false;
                //This is what function do:
                //
                //Reding input values (and cheking them to be correct)
                read(user_input_form);
                //Check hardness
                longComput = long_computation();
                //If long calculations, prompt user to continue
                if (longComput)
                    calculationsConfirmed = confirm(MML.const.msg.long_calculations);
                if (!longComput || (longComput && calculationsConfirmed))
                    calculate();
                return out();
                //Sub-functions, working in this:
                function read(HTML_form) {
                    a = MML.lib.parseFloat(HTML_form['a'].value);
                    b = MML.lib.parseFloat(HTML_form['b'].value);
                    h = MML.lib.parseFloat(HTML_form['h'].value);
                    delta_x = MML.lib.parseFloat(HTML_form['delta_x'].value);
                }
                function long_computation() {
                    return (((b - a) / h) > 200);
                }
                function calculate() {
                    var timeStart = window.performance.now();
                    for (curX = a, i = 0; curX <= b; curX += h, i++)
                    {
                        y[i] = (Math.exp(-2 * curX) + Math.pow(curX, 2) - 1);
                        x[i] = curX;
                        DELTA_x[i] = (delta_x * Math.abs(curX));
                        dy[i] = (-2 * Math.exp(-2 * curX) + 2 * curX);
                        DELTA_y[i] = dy[i] * DELTA_x[i];
                        delta_y[i] = DELTA_y[i] / Math.abs(y[i]);
                        stepsCount = i + 1;
                    }
                    calcTimeMs = window.performance.now() - timeStart;
                    calculations_performed = true;
                }
                function out() {
                    var output_multiline = '';
                    if (calculations_performed)
                    {
                        output_multiline = (' Starting conditions: a = ' + a + '; b = ' + b + '; h = ' + h + '; δx = ' + delta_x + '-----\n');
                        for (var i = 0; i <= stepsCount - 1; i++)
                            output_multiline += (' Step #' + i + ': [x = ' + x[i].toFixed(2) + '; y = ' + y[i].toFixed(5) + '; Δx = ' + DELTA_x[i].toFixed(7) + '; Δy = ' + DELTA_y[i].toFixed(7) + '; δy = ' + delta_y[i].toFixed(7) + ';]\n');
                        output_multiline += ('---Calculations finished. Time elapsed: ' + calcTimeMs.toFixed(2) + 'ms-----');
                    } else
                        output_multiline = '-----Calculations interrupted.-----';
                    return output_multiline;
                }
            }
        },
        {
            TYPE: 'MatModLab Framework engine module',
            ID: 2,
            VERSION: '2.1',
            /* "to be reviewed later" START */
            INFO_UA: {
                LOCALE: 'UA',
                LANG: 'UKR',
                TITLE: 'ОБЧИСЛЕННЯ МНОГОЧЛЕНІВ ЗА СХЕМОЮ ГОРНЕРА',
                DESCRIPTION: 'Evaluates a polynomial using Horner scheme'
            },
            INFO_NZ: {
                LOCALE: 'NZ',
                LANG: 'EN',
                TITLE: 'Polinomials solving using Horner_s method',
                DESCRIPTION: 'Evaluates a polynomial using Horner scheme'
            },
            /* END of "to be reviewed later" */


            call: function (user_input_form) {
                var stepsCount = 0,
                        curX = 0,
                        x = [],
                        y = [];
                var longComput,
                        calculationsConfirmed = false,
                        calcTimeMs = 0,
                        calculations_performed = false;
                //This is what function do:
                //
                //Reding input values (and cheking them to be correct)
                read(user_input_form);
                //Check hardness
                longComput = long_computation();
                //If long calculations, prompt user to continue
                if (longComput)
                    calculationsConfirmed = confirm(MML.const.msg.long_calculations);
                if (!longComput || (longComput && calculationsConfirmed))
                    calculate();
                return out();
                function read(HTML_form) {
                    X_n = MML.lib.parseFloat(HTML_form['X_n'].value);
                    X_k = MML.lib.parseFloat(HTML_form['X_k'].value);
                    DELTA_X = MML.lib.parseFloat(HTML_form['DELTA_X'].value);
                }
                function long_computation() {
                    return ((X_k - X_n) / DELTA_X >= 10000);
                }
                function calculate() {
                    var timeStart = window.performance.now();
                    for (stepsCount = 0, curX = X_n; curX <= X_k; curX += DELTA_X)
                    {
                        x[stepsCount] = curX;
                        y[stepsCount] = (((((curX + 0) * curX + 0) * curX - 4) * curX + 2) * curX - 4) * curX + 5;
                        stepsCount++;
                    }
                    calcTimeMs = window.performance.now() - timeStart;
                    calculations_performed = true;
                }
                function out() {
                    var output_multiline = '';
                    if (calculations_performed)
                    {
                        output_multiline += (' Starting conditions:X_n = ' + X_n + '; X_k = ' + X_k + '; ∆X = ' + DELTA_X + '.\n');
                        for (var i = 0; i <= stepsCount - 1; i++)
                            output_multiline += (' Step #' + i + ': [x = ' + x[i].toFixed(5) + '; y = ' + y[i].toFixed(5) + ';]\n');
                        output_multiline += (' ---Calculations finished. Time elapsed: ' + calcTimeMs.toFixed(2) + 'ms---');
                    } else
                        output_multiline = '-----Calculations refused-----';
                    return output_multiline;
                }
            }
        },
        {
            TYPE: 'MatModLab Framework engine module',
            ID: 3,
            VERSION: '2.1.3',
            /* "to be reviewed later" START */
            INFO_NZ: {
                LOCALE: 'NZ',
                LANG: 'EN',
                TITLE: 'Approximate solving of nonlinear equations',
                DESCRIPTION: 'Evaluates non-linear equation using numerical method'
            },
            /* END of "to be reviewed later" */

            call: function (user_input_form) {
                var itersCount = 0,
                        approx_x = 0,
                        scope = 200,
                        m = 0,
                        x = [], a = [], b = [],
                        precision = 0,
                        method_num = 0;
                var longComput,
                        calculationsConfirmed = false,
                        calcTimeMs = 0,
                        calculations_performed = false,
                        currentModule = this;
                //This is what function do:
                //
                //Reding input values (and cheking them to be correct)
                read(user_input_form);
                //Check hardness
                longComput = long_computation();
                //If long calculations, prompt user to continue
                if (longComput)
                    calculationsConfirmed = confirm(MML.const.msg.long_calculations);
                if (!longComput || (longComput && calculationsConfirmed))
                    calculate(method_num);
                return out(method_num);
                //Sub-functions, working in this:
                //
                function read(HTML_form) {
                    scope = MML.lib.parseFloat(HTML_form.scope.value);
                    precision = MML.lib.parseFloat(HTML_form.precision.value);
                    method_num = MML.lib.parseFloat(HTML_form.method_num.value);
                }
                function long_computation() {
                    if ((scope / precision) >= 100000)
                        return true;
                    else
                        return false;
                }
                function calculate(method_num) {
                    var timeStart = 0;
                    switch (method_num)
                    {
                        case 1:
                            timeStart = window.performance.now();
                            approx();
                            break;
                        case 2:
                            timeStart = window.performance.now();
                            approx();
                            combined();
                            break;
                        case 3:
                            timeStart = window.performance.now();
                            approx();
                            simpleIters();
                            break;
                        default:
                            throw new Error('Rquested method (' + method_num + ') not found');
                            break;
                    }
                    calcTimeMs = window.performance.now() - timeStart;
                    calculations_performed = true;
                    return 1;
                    function funcDeriv0(arg) {
                        return (2 * Math.exp(-arg * arg) - 3 * arg + 4);
                    }
                    function funcDeriv1(arg) {
                        return (-4 * Math.exp(-arg * arg) * arg - 3);
                    }
                    function funcDeriv2(arg) {
                        return (Math.exp(-arg * arg) * (8 * (arg * arg) - 4));
                    }
                    function approx() {
                        var resultAchieved = false,
                                step = precision;
                        itersCount = 0;
                        approx_x = 0;
                        while (!resultAchieved) {
                            itersCount++;
                            approx_x += step;
                            if (
                                    (funcDeriv0(approx_x) * funcDeriv0(-approx_x) < 0)
                                    && (funcDeriv1(approx_x) * funcDeriv1(-approx_x) > 0)
                                    && (funcDeriv2(approx_x) * funcDeriv2(-approx_x) > 0)
                                    )
                            {
                                resultAchieved = true;
                            }
                        }
                    }
                    function combined() {
                        a[0] = approx_x;
                        b[0] = -approx_x;
                        for (var i = 1; i <= itersCount; i++) {
                            a[i] = a[i - 1] - funcDeriv0(a[i - 1]) / funcDeriv1(a[i - 1]);
                            b[i] = b[i - 1] - (funcDeriv0(b[i - 1]) * (b[i - 1] - a[0]) / (funcDeriv0(b[i - 1]) - funcDeriv0(a[0])));
                        }
                    }
                    function simpleIters() {
                        m = (-2 / funcDeriv1(approx_x));
                        x[0] = approx_x;
                        for (var i = 1; i < itersCount; i++) {
                            x[i] = x[i - 1] + m * funcDeriv0(x[i - 1]);
                        }
                    }
                }
                function out(method_num) {
                    var output_multiline = '';
                    if (calculations_performed)
                    {
                        //Pring header
                        output_multiline += ('Calculations started with precision: ' + precision + '\n');
                        switch (method_num)
                        {
                            case 1:
                                output_multiline += generate_approxMeth_out();
                                break;
                            case 2:
                                output_multiline += generate_approxMeth_out();
                                output_multiline += generate_combinedMeth_out();
                                break;
                            case 3:
                                output_multiline += generate_approxMeth_out();
                                output_multiline += generate_simpleIters_out();
                                break;
                            default:
                                throw new Error('Rquested method (' + method_num + ') not found');
                                break;
                        }

                        //Print footer
                        output_multiline += (' ---Calculations finished. Time elapsed: ' + calcTimeMs.toFixed(2) + 'ms---');
                    } else
                        output_multiline = '-----Calculations refused-----';
                    return output_multiline;
                    //Functions used:
                    //
                    function generate_approxMeth_out() {
                        var str = 'Approximate method: \n';
                        //Відокремлнеий корінь
                        str += (' Found approximate value x ≈ ' + approx_x + ' on ' + itersCount + ' step , interval set [' + approx_x + ';' + (-approx_x) + ']\n');
                        return str;
                    }
                    function generate_combinedMeth_out() {
                        var str = 'Combined method: \n';
                        //Комбінований метод
                        for (var i = 0; i < itersCount; i++)
                            str += (' a[' + i + '] === ' + a[i] + '\n');
                        for (var i = 0; i < itersCount; i++)
                            str += (' b[' + i + '] === ' + b[i] + '\n');
                        return str;
                    }
                    function generate_simpleIters_out() {
                        var str = 'Simple iterations method: \n';
                        //Метод простих ітерацій
                        str += (' m = ' + m + '\n');
                        for (var i = 0; i < itersCount; i++)
                            str += (' x[' + i + '] === ' + x[i] + '\n');
                        return str;
                    }
                }
            }
        }

    ],
    init: function () {
        //Creating objects & namespace
        MML.res = {};
        MML.res.InputForm = {};
        //Shorting namespace
        MML.log = MML.lib.log;
        MML.constants = MML.const;
        MML.library = MML.lib;

        //Required for headin-switch feature
        MML.res.switchHeadingValueRemoved = false;

        //Initializations that require loaded HTML
        window.onload = function () {
            //Input form placeholer as form will be loaded dynamically and inserted into placeholder
            MML.res.InputForm.spot = document.getElementById(MML.const.HTML_struct.InputForm_spot.id);
            //Output form definition
            MML.res.OutputForm = MML.OutputForm = document.getElementById(MML.const.HTML_struct.OutputForm.id);
            //Lab number selector
            MML.res.lab_switch = document.getElementById(MML.const.HTML_struct.lab_switch.id);
            //Loading module on selector change
            MML.res.lab_switch.onchange = function () {
                MML.lib.load_module(this.value);
            };
            //Finding all elems to insert version information
            MML.res.verinfo = document.getElementsByClassName(MML.const.HTML_struct.verinfo.className);
            //Version information insert
            for (var i = 0; i < MML.res.verinfo.length; i++)
                MML.res.verinfo[i].appendChild(new MML.lib.VerinfoHTMLElem());
            //Allows to request lab preloading using URL string
            MML.lib.check_preload_request();
            //Set document texts
            document.getElementById('Labselection_Labswitch').options[0].text = 'Choose module to run';
            document.getElementById('Labselection_Labswitch').options[1].text = MML.modules[0].INFO_NZ.TITLE;
            document.getElementById('Labselection_Labswitch').options[2].text = MML.modules[1].INFO_NZ.TITLE;
            document.getElementById('Labselection_Labswitch').options[3].text = MML.modules[2].INFO_NZ.TITLE;
        };
    }
};
MML.init();