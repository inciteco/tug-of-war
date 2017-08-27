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

> You'll need firebase cli tools: `npm install -g firebase-tools`

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
- [x] ensure gameService timer durations are used in Phaser
- [ ] add loading state to login while async auth-login attempts
- [ ] add loading state while processing login (takes a few moments)
- [ ] use browserify/webpack to minify and obfuscate source code
- [ ] add cloud functions validations to mitigate cheaters
- [ ] use [bolt](https://github.com/firebase/bolt/blob/master/docs/language.md) to enforce database ACL
- [ ] play with AI after 30 seconds of waiting
- [ ] store 1 entry per day per player
- [ ] reporting feature to dump data
- [ ] use a phaser state vs share.html to speed up replay
- [ ] what else?

## found bugs!
- [ ] Private safari tabs get stuck signing in (related issues:  [1](https://stackoverflow.com/questions/28283221/firebase-authdata-from-third-party-authentication-is-always-null-in-mobile-safar), [2](https://github.com/firebase/firebaseui-web/issues/51))
- [ ] Facebook login not (always) working in safari
