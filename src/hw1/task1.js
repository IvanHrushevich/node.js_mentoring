import readline from 'readline';

const myReadline = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

myReadline.on('line', line =>
  console.log(
    line
      .split('')
      .reverse()
      .join('')
  )
);
