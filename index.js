'use strict';

const fs = require('fs');
const gunzip = require('zlib').createGunzip();

const async = require('async');
const byline = require('byline');

let follow_count = new Map();
let not_follow_count = new Map();
let follow_usage = 0;
let not_follow_usage = 0;

const files = '0123456789abcdefghijklmnopqrstuvwxyz'.split('').map(c => `googlebooks-eng-all-1gram-20120701-${c}.gz`);

const follow_re = /(^ie|[^c]ie|cei)/i;
const not_follow_re = /(^ei|[^c]ei|cie)/i;

const parts_of_speech_suffix = /_[A-Z]$/;

async.each(files, (file, callback) => {
    const stream = byline(fs.createReadStream(file).pipe(gunzip));
    stream.on('data', line => {
        let [word, year, count, books] = line.split('\t');
        if (Number(year) < 1900 || Number(year) > 1999) {
            return;
        }
        const match = word.match(parts_of_speech_suffix);
        if (match) {
            word = word.substr(0, match.index);
        }
        if (follow_re.test(word)) {
            follow_count.set(word.toLowerCase(), true);
            follow_usage += Number(count);
        }
        if (not_follow_re.test(word)) {
            not_follow_count.set(word.toLowerCase(), true);
            not_follow_usage += Number(count);
        }
    });
    stream.on('end', () => {
        return callback();
    });
}, err => {
    if (err) {
        process.exit(1);
    }
    console.log('follow_count:', follow_count.size);
    console.log('not_follow_count:', not_follow_count.size);
    console.log('follow_usage:', follow_usage);
    console.log('not_follow_usage:', not_follow_usage);
    process.exit(0);
});
