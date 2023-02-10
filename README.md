# Pencil Game

Hello, please feel free to fork this project and expand on it!

## About

This is the prototype code for a game where two players can remotely click on a moving circle and take or give control of it. The game is designed for a study and the code assumes various externally controlled factors (such as the players already having a lobby link).

## Notes

- The code has minimal comments. I apologize. This was a quick and dirty prototype, so the code can look rough at times. Still, I hope my general programming philosophies mean that the source is relatively readable.
- The main parts you need to worry about are the `public` and `server` folders. The `public` folder has all the client-side logic and front-end, and it communicates with the server code which is in the `server` folder.
- I left the `fly.toml` file in the repo because the prototype is hosted using [Fly](https://fly.io). If you decide to do something else with it, simply discard the file.
