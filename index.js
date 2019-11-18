#!/usr/bin/env node
const yeoman = require("yeoman-environment");

const env = yeoman.createEnv();

const initCommandName = "ffbt:app";
env.register(require.resolve("./generators/app"), initCommandName);

env.run(initCommandName);
