import fs from 'fs';
import stream from 'stream';
import util from 'util';

import csv from 'csvtojson';

const pipeline = util.promisify(stream.pipeline);
const csvFilePath = './src/csv/task-2-table.csv';
const txtFilePath = './src/task-2-table.txt';

pipeline(
  fs.createReadStream(csvFilePath),
  csv({
    ignoreColumns: /Amount/
  }),
  fs.createWriteStream(txtFilePath)
).catch(err => console.error('error: ', err));
