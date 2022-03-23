'use strict';

class Queue {
    constructor(taskData, runTaskProc, concurrency, erorrLimit, endQueueProc, stopFlagError = false) {

        this.runTaskProc = runTaskProc;         //ф-я исполнения заданий(процесс)
        this.concurrency = concurrency;         //ограничение по одновременно запущенным процессам
        this.erorrLimit = erorrLimit;           //предел ошибок на одну задачу
        this.endQueueProc = endQueueProc;       //ф-я после завершения обработки всей очереди
        this.stopFlagError = stopFlagError;     //флаг-остановки 
        //falsе - продолжает запускать процесс если лимит ошибок достигнут 
        //true  - останавливает запуск процессов если лимит ошибок достигнут 

        this.waiting = [];                      //место для ожидание
        this.count = 0;                         //количество в очереди
        this.outcomeMap = new Map();            //массив для хранения результатов и ошибок

        this.fewerErrorsThanNecessary = true;   //флаг - меньше ошибок, чем необходимо
        //если какая-то задача наберет столько же ошибок сколько в 
        //лимите ошибок(erorrLimit) - то станет false


        for (let i = 0; i < taskData.length; i++) {

            this.outcomeMap.set(taskData[i], { result: 0, lastError: 0, numberOfErrors: 0 });
            //result        -   результат
            //lastError     -   последняя ошибка
            //numberOfErrors-   количество ошибок

            this.add(taskData[i]);//запуск процесса
        }

    }
    //запуск процесса, taskData - данные
    add(taskData) {
        //проверка есть ли, есть ли кто в очереди
        if (this.count < this.concurrency) {
            //есть место то работаем
            this.next(taskData);
            return;
        }
        //если очередь забита, то добавляем в ожидание
        this.waiting.push(taskData);
    }

    //продолжение процесса
    next(taskData) {
        ++this.count;
        //увеличиваем количество в очереди
        this.runTaskProc(taskData, (err, result) => {//callback(err, result)
            //ошибка
            if (err) {
                this.outcomeMap.get(taskData).lastError = err;  //записываем ошибку
                ++this.outcomeMap.get(taskData).numberOfErrors; //увеличиваем счет ошибок
                --this.count;                                   //уменьшаем очередь

                //если придел ошибок не достигнут
                if ((this.outcomeMap.get(taskData).numberOfErrors < this.erorrLimit)) {
                    //запускаем ещё раз
                    this.next(taskData);
                    return;
                }
                //количество ошибок превысил лимит и есть флаг на остановку новых процессов при превышении лимитов
                //то запуск новых процессов не будет
                this.fewerErrorsThanNecessary = this.stopFlagError;
                if (this.fewerErrorsThanNecessary) {
                    this.waiting = [];                      //очередь для ожидания пуста
                    this.erorrLimit = 0;                    //больше не нужны ошибки
                    this.fewerErrorsThanNecessary = false;  //чтоб постоянно не перезаписывать данные 
                }
            } else {
                //успешно выполненная задача

                this.outcomeMap.get(taskData).result = result;  //записываем результат
                this.count--;                                   //уменьшаем очередь
            }
            //если в ожидании кто-то есть
            if (this.waiting.length > 0) {
                //удаляем из очереди 
                //удаленную переносим в taskData
                const newTaskData = this.waiting.shift();

                //запускаем новую задачу
                this.next(newTaskData);
                return;
            }

            //конец 
            if (this.count === 0) {
                this.endQueueProc(this.outcomeMap);
            }
        });
    }
}
//----------------------------------------------------

let taskData = [];
for (let i = 0; i < 100; ++i) {
    taskData.push(i);
}
const job = (data, callback) => {
    //рандом ошибки
    let result = 0;

    let err = Math.floor(Math.random() * 2);
    if (!err) {
        result = 1;
    }
    setTimeout(callback, data * 10, err, result);
    //callback(err, taskData) - функция
    //taskData * 100 - интервал
};


/**
  *  асинхронная очередь  
  *
  * @param {array}                              -   данные для задач 
  * @param {function name(taskData, callback)}  -   ф-я исполнения заданий(процесса)
  * @param {number}                             -   ограничение по процессам
  * @param {number}                             -   лимит на ошибки у одной задачи
  * @param {function name(Map)}                 -   ф-я после завершения обработки всей очереди
  * @param {boolean}                            -   флаг-остановки
  * falsе - продолжает запускать процесс если лимит ошибок достигнут 
  * true  - останавливает запуск процессов если лимит ошибок достигнут
*/
const queue = new Queue(taskData, job, 10, 5, console.log, true);

