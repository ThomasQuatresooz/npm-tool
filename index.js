#!/usr/bin/env node
import axios from 'axios';
import countryList from 'country-list';
import figlet from 'figlet';
import chalk from 'chalk';
import ora from 'ora';

const error = chalk.bold.red;
const warning = chalk.bold.keyword('orange');

var args = process.argv.slice(2);
var codeCountry = countryList.getCode(args[0]);
if (!codeCountry) {
  console.log(error('Invalid country name'));
  process.exit(1);
}

var year = args[1] || new Date().getFullYear();
let spinner = ora('fetching public holidays').start();

axios
  .get(`https://date.nager.at/api/v2/publicholidays/${year}/${codeCountry}`)
  .then((response) => {
    spinner.succeed();

    figlet(args[0], { horizontalLayout: 'fitted' }, (err, res) => {
      err ? console.log(`${args[0]}`) : console.log(res);
      console.table(response.data, ['date', 'name', 'localName']);
    });
  })
  .catch((err) => {
    spinner.fail();
    console.log(error(err));
    process.exit(1);
  });
