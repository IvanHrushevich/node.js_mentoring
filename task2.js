import fs from 'fs';
import stream from 'stream';
import util from 'util';

import csv from 'csvtojson';

const pipeline = util.promisify(stream.pipeline);
const csvFilePath = './csv/task-2-table.csv';
const txtFilePath = './task-2-table.txt';

async function convertCsvToJson() {
  await pipeline(
    fs.createReadStream(csvFilePath),
    csv(),
    fs.createWriteStream(txtFilePath)
  );
}

convertCsvToJson().catch(err => console.error('error: ', err));
