const path = require('path');
const fs = require('fs');
const readline = require('readline');
const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log');

const rs = fs.createReadStream(fileName);

const rl = readline.createInterface({
	input: rs,
});

let chromeNum = 0;
let sum = 0;

rl.on('line', (lineData) => {
	if (!lineData) {
		return;
	}
	// 总行数
	sum++;
	const arr = lineData.split(' -- ');
	if (arr[2] && arr[2].indexOf('Chrome') > 0) {
		// 累加chrome
		chromeNum++;
	}
});

rl.on('close', () => {
	console.log('chrome 占比', chromeNum / sum);
});
