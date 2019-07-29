// Decentralised, minimalist microblogging service for hackers.
require('fs').appendFileSync('twtxt.txt', new Date().toISOString() + '\t' + process.argv[2])