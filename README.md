# Gost
![Created Badge](https://badges.pufler.dev/created/MinecraftPublisher/gost-cli)
![Gost website count](https://gost.martiaforoud.repl.co/badge)


Single page app hosting with zero trouble.

```
# It's this easy to host your own website.
$ npm i -g gost-cli
$ gost -p path/to/my/webpage.html
Checking if file exists and is in HTML format...
File found, Checking for HTML syntax errors...
-- HTML file is valid --
⚠️ Would you like to test your single page app or host it on the server? ( self/server ): server
Initiating connection to host server...
[ SUCCESS ]
URL: https://gost.martiaforoud.repl.co/gost/my_gost_app.html
```

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

## FAQ
### What is gost?
Gost is a service for you to host single page applications without any effort. Just run a single command to publish your gost app to the cloud.
### How does it work?
Gost uses an HTTPS server to host a php application that saves 

### Why am I rate limited?
Gost uses a really small system to limit the submission rate to 2 seconds between submits. If you try to submit your website between those two seconds, You get rate limited.

## Installation
1. Make sure the latest version of NodeJS and NpmJS are installed on your system.
2. Open your command line.
3. Run `sudo npm i gost-host -g` to install gost.
4. Now gost is installed on your system, Type in `gost --version` and press ENTER to verify.
5. Run `gost /path/to/file` to host your file.
6. Gost will check for HTML errors and will ask you to host on local server or the HTTP server.
7. If you chose `self`:
	- The URL `http://localhost:10024` will open in your browser.
	- When you are done, Press `Ctrl + C` to exit.
8. If you chose `server`:
	- Gost will initiate a connection to the gost server. If it is successful, You will be rewarded with a text saying `Published on remote server, URL: http://some-url.com/your-page`
	- If it failed, Gost will retry up to 5 times.
	- If it still fails after that 5 times, You will get this error message `Error: Failed to connect to server and deploy site` and the program will quit.
9. Thanks reading until the end, Have fun and goodbye!
