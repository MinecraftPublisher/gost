<<<<<<< Updated upstream
# gost
Single page app hosting with zero trouble.
=======
# Gost
Single page app hosting with zero trouble.

## What is gost?
Gost is a service for you to host 

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
>>>>>>> Stashed changes
