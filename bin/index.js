#!/usr/bin/env node


// Declare requirements
const chalk = require('chalk')
const yargs = require("yargs")
const validator = require('html-validator')
const readline = require("readline")
const express = require('express')
const open = require('open');
const fs = require('fs')


// Define dependency files.
const options = yargs
    .option("p", { alias: "publish", describe: "Path to a file you want to publish.", type: "string", demandOption: true })
    .argv
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


// Check if path exists and it is an HTML file.
console.log(chalk.yellowBright('Checking if file exists and is in HTML format...'))
const path = options.publish;
if (!path.endsWith('.html')) { console.log(chalk.red.bold('Error: The specified file is not in HTML format.')); return }
if (!fs.existsSync(path)) { console.log(chalk.red.bold('Error: Couldn\'t find the specified file.')); return }


// Read the file and check formatting.
console.log(chalk.yellowBright('File found, Checking for HTML syntax errors...'))
const file = fs.readFileSync(path).toString()

validator({
    format: 'text',
    data: file
})
    .then((result) => { console.log(chalk.greenBright.bold('-- HTML file is valid --')); progress1() })
    .catch((err) => { console.error(err) })

function progress1() {
    read.question('⚠️ Would you like to test your single page app or host it on the server? ( self/server ): ', function (response) {
        if (response.toLowerCase() == 'self') {
            hostSelf()
        } else if (response.toLowerCase() == 'server') {
            runOnServer()
        } else {
            console.log(chalk.redBright.bold('Error: ' + response.toLowerCase() + ' is not a valid option.'))
            progress1()
        }
    })
}

function hostSelf() {
    console.clear()
    console.log(chalk.greenBright.bold('Starting local HTTP server...'))
    const app = express()
    app.use(function (req, res, next) {
        console.log(chalk.bgWhite.gray.bold('[+] New request: http://localhost:10024' + req.url))
        if (req.url == '/')
            res.send(file)
        else
            res.status(404).send(file)
    })
    app.listen(10024, function () { console.log(chalk.yellowBright.bold('[-] Local HTTP server running at http://localhost:10024')); open('http://localhost:10024') })
}

function runOnServer() {
    console.log(chalk.greenBright.bold('Initiating connection to host server...'))
    console.log(chalk.redBright.bold('[ gost does not support a host yet, but we are working on it ]'))
    read.close()
}

function quit () {
    console.clear()
    console.log(chalk.redBright.bold('[ Thanks for using gost ]'));
    setTimeout(function () {
        process.exit();
    }, 100)
}

read.on('close', quit)

process.on('SIGINT', quit);