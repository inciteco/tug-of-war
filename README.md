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

You can generate csv-formatted reports with the command below:
```sh
firebase use production && npm run reports
```

This will create two timestamp-prefixed files in `reports/`:
```sh
reports
├── 2017-09-05T13:46:50-entries.csv
└── 2017-09-05T13:46:50-opt_ins.csv
```

## Compressing assets

There is a script to compress all source images in the `src/assets/images` folder into the `public/assets/images`. The initial pass reduced our load from 77mb to 10mb.


This should be used whenever new images are added:

```
npm run compress
```

## Deploying

Deploy to Staging:
```
firebase use default && firebase deploy
```

Deploy to Production:
```
firebase use production && firebase deploy
```

## other notes

You can logout via the developer console with:
```
gameService.signOut()
```

*localStorage corruption?*
If you get weird caching things after updating js files, try running this in the chrome dev tools console while on the page:
`localStorage.clear()`

## Source PSD

A fully layered, editable psd is in the root of /src which contains all visual assets

## Known Issues
- [x] [#2](/../../issues/2) Can't login when in private Safari tabs
- [ ] [#27](/../../issues/27) Back button leads to losing and freezing
- [ ] [#22](/../../issues/22) Sticky name/avatar
- [ ] Find something? [Report an issue](/../../issues/new)
