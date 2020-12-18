const fs = require("fs");
const { type } = require("os");
let command = process.argv[2];
let usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;
if (command === 'help' || command === undefined) {
    console.log(usage);
}

if (command === 'add') {
    if (process.argv[3] === undefined) {
        console.log("Error: Missing todo string. Nothing added!");
    }
    else {
        let text = `Added todo: "${process.argv[3]}"`;
        fs.appendFileSync("todo.txt", `${process.argv[3]}\n`);
        console.log(text);
    }
}

if (command === 'ls') {
    try {
        let text = fs.readFileSync("todo.txt", "utf-8");
        if (text === '' || text === '\n')
            console.log('There are no pending todos!');
        else {
            text = text.split('\n');
            for (let index = text.length - 2; index >= 0; index--) {
                console.log(`[${index + 1}] ${text[index]}`);
            }
        }
    }
    catch (err) {
        console.log('There are no pending todos!');
    }
}

if (command === 'report') {
    let todo = fs.readFileSync("todo.txt", "utf-8");
    todo = todo.split('\n');
    let countpending = todo.length;
    if (countpending >= 1)
        countpending--;

    let done = fs.readFileSync("done.txt", "utf-8");
    done = done.split('\n');
    let countdone = done.length;
    if (countdone >= 1)
        countdone--;
    let date = new Date();
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    console.log(`${date} Pending : ${countpending} Completed : ${countdone}`);
}

if (command === 'done') {
    let number = process.argv[3];
    if (number === undefined) {
        console.log("Error: Missing NUMBER for marking todo as done.");
    }
    else {
        let text = fs.readFileSync("todo.txt", "utf-8");
        text = text.split('\n');
        if (text[number - 1] === undefined)
            console.log(`Error: todo #${number} does not exist.`);
        else {
            let donetask = text[number - 1] + '\n';
            text.splice(number - 1, 1);
            text[text.length - 1] += ',';
            fs.writeFileSync('todo.txt', text.toString().replace(',', '\n'));
            fs.appendFileSync('done.txt', donetask);
            console.log(`Marked todo #${number} as done.`);
        }
    }
}
if (command === 'del') {
    let number = process.argv[3];
    if (number === undefined) {
        console.log("Error: Missing NUMBER for deleting todo.");
    }
    else {
        let text = fs.readFileSync("todo.txt", "utf-8");
        text = text.split('\n');
        console.log(text[number-1]);
        if (text[number-1] === undefined||text[number-1] === '')
            console.log(`Error: todo #${number} does not exist. Nothing deleted.`);
        else{
            text.splice(number - 1, 1);
            text[text.length - 1] += ',';
            fs.writeFileSync('todo.txt', text.toString().replace(',', '\n'));
            console.log(`Deleted todo #${number}`);
        }
    }
}