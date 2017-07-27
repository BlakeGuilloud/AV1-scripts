#!/usr/bin/env node

const commander = require('commander');
const deployments = require('./deployments');

commander.version('2.10.0');
commander
  .command('deploy [name] [bucket] [profile]')
  .description('Deploys React App')
  .action((name, bucket, profile) => {
    deployments[name](bucket, profile);
  });

commander.parse(process.argv);
