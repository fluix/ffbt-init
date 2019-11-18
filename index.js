#!/usr/bin/env node
const yeoman = require("yeoman-environment");

const [,,destinationPath] = process.argv;
const env = yeoman.createEnv();

const initCommandName = "ffbt:app";
env.register(require.resolve("./generators/app"), initCommandName);

env.run(initCommandName, {
    destination: destinationPath,
});
