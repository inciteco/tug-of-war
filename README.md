# Popeye's Tug O' War

Links:
- [repo](https://github.com/inciteco/tug-of-war)
- [play now](https://popeyes-tug-o-war.firebaseapp.com)
- [database](https://console.firebase.google.com/u/0/project/popeyes-tug-o-war/database/data)

## Quick start

```sh
git clone git@github.com:inciteco/tug-of-war.git
cd tug-of-war && npm install
npm start
```

## Compressing assets

There is a script to compress all source images in the `src/assets/images` folder into the `public/assets/images`. The initial pass reduced our load from 77mb to 10mb.


This should be used whenever new images are added:

```
npm run compress
```

## Deploying

```
npm install -g firebase-tools
firebase init
firebase deploy
```

## other notes

You can logout via the developer console with:
```
gameService.signOut()
```

## todos

- [x] configure firebase deploy
- [x] make sure touch is working on login on mobile
- [x] add logout
- [x] determine winner by greater score
- [x] determine winner during tie
- [x] win when score > threshold
- [x] compress image assets
- [ ] swap png assets for jpg where appropriate
- [ ] compress audio assets
- [ ] ensure gameService timer durations are used in Phaser
- [ ] add loading state to login while async auth-login attempts
- [ ] add loading state while processing login (takes a few moments)
- [ ] use browserify/webpack to minify and obfuscate source code
- [ ] add cloud functions validations to mitigate cheaters
- [ ] play with AI after 30 seconds of waiting
- [ ] store 1 entry per day per player
- [ ] reporting feature to dump data
- [ ] what else?
