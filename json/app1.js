'use strict';
const fs = require('fs');

//открываем файл
let rawdata = fs.readFileSync('resNew1.json');
let resNew = JSON.parse(rawdata);


class Abc {
    constructor() {
        this.abc = [];//основный массив




        for (let i = 0; i < resNew.length; i++) {
            //зануляем количество abc 
            this.abc[i] = {
                F1: {//count - количество, difference_time_max максимальное время между связью
                    0: { count: 0, difference_time_max: 0, continuously: 0 },
                    1: { count: 0, difference_time_max: 0, continuously: 0 },
                    2: { count: 0, difference_time_max: 0, continuously: 0 },
                    3: { count: 0, difference_time_max: 0, continuously: 0 },
                    SM160: 0
                },
                F2: {
                    0: { count: 0, difference_time_max: 0, continuously: 0 },
                    1: { count: 0, difference_time_max: 0, continuously: 0 },
                    2: { count: 0, difference_time_max: 0, continuously: 0 },
                    3: { count: 0, difference_time_max: 0, continuously: 0 },
                    SM160: 0
                }
            }
            // количество и разницы во времени
            this._quantityAndTimeDifferenceCounter("F1", i);
            this._quantityAndTimeDifferenceCounter("F2", i)
        }
    }
    _actionIfAbc(i, F, number, dateDifference, lastNumberAbc) {


    }
    _quantityAndTimeDifferenceCounter(F, i) {
        //старое время связи
        //первое время
        let dateOld = Date.parse(resNew[i][F + "res"][0].data.replace(/\./g, "-") +
            "T" + resNew[i][F + "res"][0].time.slice(0, -1) + "Z");
        //первое число
        let lastNumberAbc = +(resNew[i][F + "res"][0].panid.slice(3, 4));

        this.abc0_t = 0;
        this.abc1_t = 0;
        this.abc2_t = 0;
        this.abc3_t = 0;

        for (let j = 0; j < resNew[i][F + "res"].length; j++) {

            //новая дата
            let dateNew = Date.parse(resNew[i][F + "res"][j].data.replace(/\./g, "-") +
                "T" + resNew[i][F + "res"][j].time.slice(0, -1) + "Z");
            //разница по времени
            let dateDifference = dateNew - dateOld;
            //получаем abc

            if (resNew[i][F + "res"][j].SM160)
                ++this.abc[i][F].SM160;

            switch (resNew[i][F + "res"][j].panid) {

                case "abc0":
                    if (lastNumberAbc !== 0) {

                        if (this.abc[i][F][lastNumberAbc].difference_time_max < dateNew - this["abc" + lastNumberAbc + "_t"]) {
                            this.abc[i][F][lastNumberAbc].difference_time_max = dateNew - this["abc" + lastNumberAbc + "_t"];
                        }

                        //последние abc) и его время
                        lastNumberAbc = 0;
                        this.abc0_t = dateNew;

                    } else {
                        if (this.abc[i][F][0].continuously < dateNew - this.abc0_t) {
                            this.abc[i][F][0].continuously = dateNew - this.abc0_t;
                        }

                    }
                    ++this.abc[i][F][0].count; //увеличиваем кол-во abc
                    break;

                case "abc1":

                    if (lastNumberAbc !== 1) {

                        if (this.abc[i][F][lastNumberAbc].difference_time_max < dateNew - this["abc" + lastNumberAbc + "_t"]) {
                            this.abc[i][F][lastNumberAbc].difference_time_max = dateNew - this["abc" + lastNumberAbc + "_t"];
                        }

                        //последние abc) и его время
                        lastNumberAbc = 1;
                        this.abc1_t = dateNew;
                    } else {
                        if (this.abc[i][F][1].continuously < dateNew - this.abc1_t) {
                            this.abc[i][F][1].continuously = dateNew - this.abc1_t;
                        }

                    }
                    ++this.abc[i][F][1].count;  //увеличиваем кол-во abc

                    break;
                case "abc2":

                    if (lastNumberAbc !== 2) {

                        if (this.abc[i][F][lastNumberAbc].difference_time_max < dateNew - this["abc" + lastNumberAbc + "_t"]) {
                            this.abc[i][F][lastNumberAbc].difference_time_max = dateNew - this["abc" + lastNumberAbc + "_t"];
                        }


                        lastNumberAbc = 2;

                        this.abc2_t = dateNew;




                    } else {
                        if (this.abc[i][F][2].continuously < dateNew - this.abc2_t) {
                            this.abc[i][F][2].continuously = dateNew - this.abc2_t;
                        }

                    }
                    ++this.abc[i][F][2].count;  //увеличиваем кол-во abc

                    break;
                case "abc3":

                    if (lastNumberAbc !== 3) {


                        if (this.abc[i][F][lastNumberAbc].difference_time_max < dateNew - this["abc" + lastNumberAbc + "_t"]) {
                            this.abc[i][F][lastNumberAbc].difference_time_max = dateNew - this["abc" + lastNumberAbc + "_t"];
                        }
                        lastNumberAbc = 3;

                        this.abc3_t = dateNew;

                    } else {
                        if (this.abc[i][F][3].continuously < dateNew - this.abc3_t) {
                            this.abc[i][F][3].continuously = dateNew - this.abc3_t;
                        }

                    }
                    ++this.abc[i][F][3].count;  //увеличиваем кол-во abc

                    break;
            }
            //новое время становится старым
            dateOld = dateNew;
        }
    }
    //приводим секунды в hh:mm:ss
    _formatWriteDate(i, F, j) {
        //создаем объект время 
        let rawDate = new Date(this.abc[i][F][j].difference_time_max);

        let hour = rawDate.getHours(rawDate) - 3;   //часы 
        let minutes = rawDate.getMinutes(rawDate);  //минуты
        let seconds = rawDate.getSeconds(rawDate);  //секунды

        //перезаписоваем время
        this.abc[i][F][j].difference_time_max = hour + ':' + minutes + ":" + seconds;


        rawDate = new Date(this.abc[i][F][j].continuously);

        hour = rawDate.getHours(rawDate) - 3;   //часы 
        minutes = rawDate.getMinutes(rawDate);  //минуты
        seconds = rawDate.getSeconds(rawDate);  //секунды

        //перезаписоваем время
        this.abc[i][F][j].continuously = hour + ':' + minutes + ":" + seconds;
    }
    //вывод
    printAbc() {
        //приводим секунды в hh:mm:ss
        for (let i = 0; i < resNew.length; i++) {
            for (let j = 0; j < 4; j++) {
                this._formatWriteDate(i, "F1", j);
                this._formatWriteDate(i, "F2", j);
            }
        }
        //вывод в файл
        let srtAbc = JSON.stringify(this.abc);
        fs.writeFileSync('abc.json', srtAbc);
    }
}

let class_abc = new Abc;

class_abc.printAbc();






