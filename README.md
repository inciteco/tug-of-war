# Popeye's Tug O' War

Links:
- [repo](https://github.com/inciteco/tug-of-war)
- [play now](https://popeyes-tug-o-war.firebaseapp.com)
- [facebook app](https://developers.facebook.com/apps/472656139771979/dashboard/)
- [database](https://console.firebase.google.com/u/0/project/popeyes-tug-o-war/database/data)

## Quick start

```sh
git clone git@github.com:inciteco/tug-of-war.git
cd tug-of-war && npm install
npm start
```

### Dev Scripts

There's a few dev scripts to help automate things, to use these you'll want to install these dependencies:

Installing *(on Mac OS X)*:
```sh
brew update
brew install ffmpeg
brew install lame
brew install --with-libvorbis --with-lame sox
```

## Compressing assets

There is a script to compress all source images in the `src/assets/images` folder into the `public/assets/images`. The initial pass reduced our load from 77mb to 10mb.


This should be used whenever new images are added:

```
npm run compress
```

## Deploying

```
npm run deploy
```

## other notes

You can logout via the developer console with:
```
gameService.signOut()
```

*localStorage corruption?*
If you get weird caching things after updating js files, try running this in the chrome dev tools console while on the page:
`localStorage.clear()`

## Todos

The following items are still in the works!

### Front-end stuff (mostly Brett)
- [x] ensure touch is working on login on mobile
- [x] ensure gameService timer durations are used in Phaser
- [x] add logout
- [x] compress image assets
- [ ] compress audio assets
- [ ] swap png assets for jpg where appropriate
- [x] style loading state while processing login (takes a few moments)
- [ ] toggle the login-form if async-login doesn't find a user (AB to help here)
- [ ] use browserify/webpack to minify and obfuscate source code (AB)
- [ ] play with AI after 10 seconds of waiting (AB)
- [x] use a phaser state vs share.html to speed up replay
- [x] show big box in position at endgame (AB)
- [ ] adjust threshold positions (AB)
- [ ] add video player controls

### Multiplayer GameServices stuff (AB)
- [x] configure firebase deploy
- [x] determine winner by greater score
- [x] determine winner during tie
- [x] win when score > threshold
- [ ] add cloud functions validations to mitigate cheaters
  - [ ] use [bolt](https://github.com/firebase/bolt/blob/master/docs/language.md) to enforce database ACL
  - [ ] use [validation rules](https://firebase.google.com/docs/database/security/) to:
    - [ ] limit changes in score
    - [ ] enforce start/end times
    - [ ] only allow read if <2 participants?
    - [ ] enforce participants?
    - [ ] store 1 entry per day per player
- [ ] reporting feature to dump data
- [ ] send proper asset when non FB user logs in
- [ ] send proper object info when bot player is used
- [ ] enable FB share button on share.js
- [ ] gather checkbox data

## found bugs!
- [ ] Private safari tabs get stuck signing in (related issues:  [1](https://stackoverflow.com/questions/28283221/firebase-authdata-from-third-party-authentication-is-always-null-in-mobile-safar), [2](https://github.com/firebase/firebaseui-web/issues/51))
- [ ] Facebook login not (always) working in safari
- [ ] First few moves (sometimes none of them) don't always seem to register (visually)
- [ ] Play Again button takes user back to waitforplayer, but it doesn't ever link you to another player. Just waits...
