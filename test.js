const Queue = require("./queue");

//тест
let taskData = [];
for (let i = 0; i < 50; ++i) {
    taskData.push({ id: i });
}
const job = (data, callback) => {
    //рандом ошибки
    let result = 0;

    let err = Math.floor(Math.random() * 2);
    if (!err) {
        result = 1;
    }

    setTimeout(callback, data.id * 1, err, result);
    //callback(err, taskData) - функция
    //taskData * 100 - интервал
};


const queue = new Queue(taskData, job, 1, 5, console.log, true);