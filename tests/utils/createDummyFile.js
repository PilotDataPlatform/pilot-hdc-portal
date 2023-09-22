/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
const fs = require('fs');

function write(stream, size) {
  return new Promise((resolve) => {
    let chunk = createChunk(size);

    stream.write(chunk, () => {
      chunk = null;
      console.log(`Wrote ${size} bytes...`);
      resolve();
    });
  });
}

async function writeMany(stream, size, times) {
  for (let i = 0; i < times; i++) {
    console.log(`Writing chunk ${i + 1}/${times}`);
    await write(stream, size);
  }

  return;
}

function createChunk(size) {
  const charset =
    'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  let chunk = '';

  for (let i = 0; i < size; i++) {
    chunk += charset[Math.floor(Math.random() * charset.length)];
  }

  return chunk;
}

async function createDummyFile(folderName, filename, size) {
  if (typeof filename !== 'string' || typeof size !== 'string') {
    console.log('Both filename and size must be provided!');
    process.exit(1);
  }

  const bMatch = size.match(/^(\d+)$/i);
  const kbMatch = size.match(/^(\d+)kb$/i);
  const mbMatch = size.match(/^(\d+)mb/i);
  const gbMatch = size.match(/^(\d+)gb/i);
  const filepath = `${process.cwd()}/tests/uploads/${folderName}/${filename}`;
  let chunkSize = 0;

  if (bMatch) size = +bMatch[1];
  if (kbMatch) size = +kbMatch[1] * 1000;
  if (mbMatch) size = +mbMatch[1] * 1000 * 1000;
  if (gbMatch) size = +gbMatch[1] * 1000 * 1000 * 1000;

  chunkSize = Math.floor(size / 10);

  if (!chunkSize) chunkSize = 256;
  if (chunkSize > 10 * 1000 * 1000) chunkSize = 10 * 1000 * 1000;

  const stream = fs.createWriteStream(filepath, { highWaterMark: chunkSize });

  const rounds = Math.floor(size / chunkSize);
  const lastRound = size % chunkSize;

  return writeMany(stream, chunkSize, rounds)
    .then(() => {
      stream.end(createChunk(lastRound), () => {
        console.log('File has been generated.');
      });
    })
    .catch(console.log);
}

module.exports = { createDummyFile }
