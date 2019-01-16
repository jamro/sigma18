# sigma18
My entry for [Gynvael's Winter GameDev Challenge 2018/19](https://gynvael.coldwind.pl/?lang=en&id=697)

# Rules of the Challenge
Create a game that meets the following requirements:

- The game must be an unrealistic hacking simulator.
- The game setting must be: the player is a space marine's tech/hacker that aids a squad of space marines while they explore an abandoned space station.
- The game must be made in client-side web technology that runs by default on the newest stable Chrome on Windows 10 (1803/1809)
- The game has to render in a 1920x1080 resolution (please assume Chrome in full screen mode at that exact resolution)
- It must render [this placeholder image](resources/img/gwgc201819_overlay.png) on top of everything - this image effectively only allows to draw game content in two regions (assume these are two separate displays on a spaceship's console).
- The size of the whole game (i.e. sum of sizes of all the files) must be at most 128000 bytes (everything, including all art, fonts, etc). Please note that the provided overlay image does NOT count towards the limit (neither do the readme file, nor the source package).
- All the game files and directories must use the 8.3 filename format (i.e. 8 letters for the filename and 3 letters for the extension or less). There cannot be more than 20 files + directories in total. Minor exception: feel free to use .html and .wasm extensions as well (but only these two; the 8-character file name limit still applies in these cases).
- The text in game, if any, must be in English.
- The game must have a title and a text readme file containing a description how to play.
- Submission deadline is 31st of January 2019 at 11:59pm (23:59) AoE

More details at [Gynvael's Winter GameDev Challenge 2018/19](https://gynvael.coldwind.pl/?lang=en&id=697)

# The Plot
It's the year 2080. You are a space marine's tech who specializes in security and hacking. The squad that you are supporting is leading by commander Alex Decker. They are on their way back home from a reconnaissance mission in The Teta Colony. Unfortunately, the spaceship was damaged and they were forced to have an emergency landing at International Space Station Sigma-18. The ship was wrecked during the landing so you must help the squad to find another way out.


# How to Play
![Game Screenhot](docs/screenshot.png)

You should be able to find all instruction in the game. Here are a few hints for the beginning:

- use left console to run commands and hack systems of ISS Sigma-18
- right screen shows map and current location of the squad. Only visited location are show on the map
- to list all available commands type **help** and press ENTER. At the beginning there is not many of them available, however, you will get more commands as proceeding in the game
- **up/down arrows** navigates through the history of the console
- to get help about specific command run **[CommandName help]**. (For example **sfx help**)
- You can communicate with commander Decker via **com** command. See **com help** for more info.
- If you really got stuck, you can ask commander Decker for help by running **com hint**. However you should be able to complete the game without that.

# Code Quality
Due to the limit of 128000 bytes, this is not the most beautiful code that you can find on the Internet :) Focus on the gameplay and have fun instead :)
