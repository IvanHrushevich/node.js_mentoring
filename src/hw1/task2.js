import fs from 'fs';
import stream from 'stream';
import util from 'util';

import csv from 'csvtojson';

const pipeline = util.promisify(stream.pipeline);
const csvFilePath = './src/hw1/csv/task-2-table.csv';
const txtFilePath = './src/hw1/task-2-table.txt';

pipeline(
  fs.createReadStream(csvFilePath),
  csv({
    headers: ['book', 'author', 'amount', 'price'],
    colParser: {
      book: 'string',
      author: 'string',
      amount: 'omit',
      price: 'number'
    }
  }),
  fs.createWriteStream(txtFilePath)
).catch(err => console.error('error: ', err));
