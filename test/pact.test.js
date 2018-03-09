const tests = require("promises-aplus-tests");
const adapter = require("./gateway");

tests.mocha(adapter);
