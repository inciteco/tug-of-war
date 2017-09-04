# Popeye's Tug O' War

Links:
- [Repo](https://github.com/inciteco/tug-of-war)
- [Play now](https://popeyes-tug-o-war.firebaseapp.com)
- [Facebook app](https://developers.facebook.com/apps/472656139771979/dashboard/)
- Firebase projects:
  - [Staging](https://console.firebase.google.com/u/0/project/popeyes-tug-o-war/database/data)
  - [Production](https://console.firebase.google.com/u/0/project/bigboxcraveoff-prod)

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
brew install jq
```

## Reporting

You can generate a csv of all user sweeps entries with the following command:

```sh
npm use production
npm run entries-report
```

> Note: make sure you've run `brew install jq`

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
- [x] compress audio assets
- [x] swap png assets for jpg where appropriate
- [x] style loading state while processing login (takes a few moments)
- [x] toggle the login-form if async-login doesn't find a user (AB to help here)
- [x] play with AI after 10 seconds of waiting (AB)
- [x] use a phaser state vs share.html to speed up replay
- [x] show big box in position at endgame (AB)
- [x] adjust threshold positions (AB)
- [x] add video player controls

### Multiplayer GameServices stuff (AB)
- [x] configure firebase deploy
- [x] determine winner by greater score
- [x] determine winner during tie
- [x] win when score > threshold
- [x] add cloud functions validations to mitigate cheaters
  - [x] use [bolt](https://github.com/firebase/bolt/blob/master/docs/language.md) to enforce database ACL
  - [x] use [validation rules](https://firebase.google.com/docs/database/security/) to:
    - [x] only allow read if <2 participants?
    - [x] enforce participants?
    - [x] store 1 entry per day per player
- [x] reporting feature to dump data
- [x] send proper asset when non FB user logs in
- [x] send proper object info when bot player is used
- [x] enable FB share button on share.js
- [x] gather checkbox data
    - [x] if under 18 do not grant entries
    - [x] if newsletter is checked, record user name, email
    - [x] if under 18 disregard ^ 

## found bugs!
- [ ] Private safari tabs get stuck signing in (related issues:  [1](https://stackoverflow.com/questions/28283221/firebase-authdata-from-third-party-authentication-is-always-null-in-mobile-safar), [2](https://github.com/firebase/firebaseui-web/issues/51))
- [x] Facebook login not (always) working in safari
- [x] First few moves (sometimes none of them) don't always seem to register (visually)
- [x] Play Again button takes user back to waitforplayer, but it doesn't ever link you to another player. Just waits...
