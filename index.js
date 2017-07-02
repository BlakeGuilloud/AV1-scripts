#!/usr/bin/env node

const commander = require('commander');
const deployments = require('./deployments');

commander.version('2.10.0');
commander.command('deploy [value] [value]')
  .description('Deploys React App')
  .action((name, path) => {
    console.log('name', name);
    deployments[name];
    // rcc.createFile(name, 'components', path);
  });

commander.parse(process.argv);