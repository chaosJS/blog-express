const path = require('path');
const fs = require('fs');

const createWriteStream = (fileName) => {
	const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName);
	const ws = fs.createWriteStream(fullFileName, { flags: 'a' });
	return ws;
};
const access = (log) => {
	const accessWS = createWriteStream('access.log');
	accessWS.write(log + '\n');
};
module.exports = {
	access,
};
