#!/usr/bin/env node


// Declare requirements
const chalk = require('chalk')
const yargs = require("yargs")
const validator = require('html-validator')
const readline = require("readline")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express = require('express')
const open = require('open')
const path = require('path');
const fs = require('fs')

var exit = chalk.redBright.bold('[ Thanks for using gost ]')

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        else if(xmlHttp.readyState == 4) {
            exit = chalk.redBright.bold('[ Failed to receive update with error code ' + xmlHttp.status + ' ]')
            quit()
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

// Define dependency files.
const options = yargs
    .option("p", { alias: "publish", describe: "Path to a file you want to publish.", type: "string" })
    .option("d", { alias: "discord", describe: "Join our discord server" })
    .option("u", { alias: "update", describe: ""})
    .argv
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

if(options.update)
    update()

if (options.discord)
    quit()

if (process.argv.length == 2) {
    exit = '[ gost ]\nSingle page app hosting with zero trouble.\nRun ' + chalk.bgYellow.black.bold('gost --version') + ' to view your current gost version\nRun ' + chalk.bgYellow.black.bold('gost --help') + ' to view available options.\nRun ' + chalk.bgYellow.black.bold('gost --update') + ' to check for updates.'
    quit()
}

if(options.publish) {
    progress1()
}

function update() {
    console.log(chalk.yellowBright.bold('Checking if there are any available updates...'))
    httpGetAsync('https://github.com/MinecraftPublisher/gost-cli/raw/main/bin/index.js', function (data) {
        console.log('Received pack1')
        httpGetAsync('https://github.com/MinecraftPublisher/gost-cli/raw/main/package.json', function (package) {
            console.log('Received pack2')
            promptInstall(data, package)
        })
    })
}

function promptInstall(data, package) {
    const current = fs.readFileSync(__filename).toString()
    if (current == data) {
        console.log(chalk.green.bold('[ NEW VERSION FOUND ]'))
        read.question('Would you like to update to the newer version? (y/N) ', function(res) {
            if(res.toLowerCase() == 'y')
                install(data, package)
            else if(res.toLowerCase() == 'n')
                progress1()
            else {
                console.log(chalk.bold(res) + ' is not a valid option!')
                promptInstall()
            }
        })
    }
}

function install(data, package) {
    fs.writeFileSync(__filename, data)
    fs.writeFileSync(path.join(__dirname, '..', 'package.json'), package)
    console.log(chalk.greenBright.bold('-- UPDATE COMPLETE --'))
    progress1()
}

var file;

function progress1() {
    // Check if path exists and it is an HTML file.
    console.log(chalk.yellowBright('Checking if file exists and is in HTML format...'))
    const path = options.publish || '';
    if (!path.endsWith('.html')) { exit = chalk.red.bold('Error: The specified file is not in HTML format.'); quit() }
    if (!fs.existsSync(path)) { exit = chalk.red.bold('Error: Couldn\'t find the specified file.'); quit() }


    // Read the file and check formatting.
    console.log(chalk.yellowBright('File found, Checking for HTML syntax errors...'))
    file = fs.readFileSync(path).toString()
    validator({
        format: 'text',
        data: file
    })
        .then((result) => { console.log(chalk.greenBright.bold('-- HTML file is valid --')); httpGetAsync('https://api.countapi.xyz/hit/gost-cli.js.org/visits', progress2) })
        .catch((err) => { console.error(err) })
}

function progress2() {
    read.question('⚠️ Would you like to test your single page app or host it on the server? ( self/server ): ', function (response) {
        if (response.toLowerCase() == 'self') {
            hostSelf()
        } else if (response.toLowerCase() == 'server') {
            runOnServer()
        } else {
            console.log(chalk.redBright.bold('Error: ' + response.toLowerCase() + ' is not a valid option.'))
            progress2()
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