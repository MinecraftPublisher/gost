#!/usr/bin/env node


// Declare requirements
const chalk = require('chalk')
const yargs = require("yargs")
const validator = require('html-validator')
const readline = require("readline")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express = require('express')
const open = require('open')
const fs = require('fs')

var exit = chalk.redBright.bold('[ Thanks for using gost ]')

// Define dependency files.
const options = yargs
    .option("p", { alias: "publish", describe: "Path to a file you want to publish.", type: "string" })
    .option("d", { alias: "discord", describe: "Join our discord server" })
    .argv
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

if (options.discord)
    quit()

if(process.argv.length == 2) {
    exit = '[ gost ]\nSingle page app hosting with zero trouble.\nRun ' + chalk.bgYellow.black.bold('gost --version') + ' to view your current gost version\nRun ' + chalk.bgYellow.black.bold('gost --help') + ' to view available options.'
    quit()
}

// Check if path exists and it is an HTML file.
console.log(chalk.yellowBright('Checking if file exists and is in HTML format...'))
const path = options.publish || '';
if (!path.endsWith('.html')) { exit = chalk.red.bold('Error: The specified file is not in HTML format.'); quit() }
if (!fs.existsSync(path)) { exit = chalk.red.bold('Error: Couldn\'t find the specified file.'); quit() }


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
    var done = false

    console.log(chalk.greenBright.bold('Initiating connection to host server...'))
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            done = true
            const response = xmlHttp.responseText
            if (response == 'fail') {
                exit = chalk.redBright.bold('Error: Failed to write data to the server, Please open an issue on gost\'s github repository.')
                read.close()
            }
            else {
                exit = chalk.greenBright.bold('[ SUCCESS ]') + '\n' + chalk.yellowBright.bold('URL: ') + chalk.bgWhite.blackBright.bold(response)
                read.close()
            }
        }
        else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
            if (xmlHttp.status == 429) {
                exit = chalk.redBright.bold('Error: The server is locked, Please try again in ' + xmlHttp.responseText + ' seconds.')
                read.close()
            }
            else {
                done = true
                exit = chalk.redBright.bold('Error: Failed to connect to server, Is there a firewall blocking your connection?')
                read.close()
            }
        }
    }
    xmlHttp.open("POST", 'https://gost.martiaforoud.repl.co/gost', true);
    xmlHttp.send(JSON.stringify({
        "gost": true,
        "data": file
    }));
}


function quit() {
    console.log(exit);
    console.log(chalk.greenBright.bold('Make sure to join our discord: https://discord.gg/PjRkS7V8HM'))
    process.exit();
}

read.on('close', quit)

process.on('SIGINT', quit);