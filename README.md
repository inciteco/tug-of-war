# tug-of-war

## quick start

```sh
git clone git@github.com:inciteco/tug-of-war.git
cd tug-of-war && npm install
npm start
```

## deploy

```
npm install -g firebase-tools
firebase init
firebase deploy
```

## notes

You can logout via the developer console with:
```
gameService.signOut()
```

## todos

- [x] configure firebase deploy
- [x] make sure touch is working on login on mobile
- [x] compress image and audio assets
- [x] add logout
- [ ] add loading state to login while async auth-login attempts
- [ ] add loading state while processing login (takes a few moments)
- [ ] use browserify/webpack to minify and obfuscate source code
- [ ] add cloud functions validations to mitigate cheaters
- [ ] play with AI after 30 seconds of waiting
- [ ] store 1 entry per day per player
- [ ] reporting feature to dump data
- [ ] what else?
