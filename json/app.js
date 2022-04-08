'use strict';

const fs = require('fs');

//открываем файл
let rawdata = fs.readFileSync('resNew.json');
let resNew = JSON.parse(rawdata);

//создаем структуру
let abc = [];

//перебираем "счетчики"
for (let i = 0; i < resNew.length; i++) {
    //зануляем количество abc 
    abc[i] = {
        F1: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
        },
        F2: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
        }
    }
    //перебираем все опросы и собираем количество разных abc
    //для f1
    for (let j = 0; j < resNew[i].F1res.length; j++) {
        switch (resNew[i].F1res[j].panid) {
            case "abc0":
                ++abc[i].F1[0];
                break;
            case "abc1":
                ++abc[i].F1[1];
                break;
            case "abc2":
                ++abc[i].F1[2];
                break;
            case "abc3":
                ++abc[i].F1[3];
                break;
        }
    };
    //для f2
    for (let j = 0; j < resNew[i].F2res.length; j++) {
        switch (resNew[i].F2res[j].panid) {
            case "abc0":
                ++abc[i].F2[0];
                break;
            case "abc1":
                ++abc[i].F2[1];
                break;
            case "abc2":
                ++abc[i].F2[2];
                break;
            case "abc3":
                ++abc[i].F2[3];
                break;
        }
    }
}

//
//вывод

let srtAbc = JSON.stringify(abc);
fs.writeFileSync('abc.json', srtAbc);
