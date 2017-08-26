# tug-of-war

## quick start

```sh
git clone git@github.com:inciteco/tug-of-war.git
cd tug-of-war && npm install
npm start
```

## notes

You can logout via the developer console with:
```
gameService.signOut()
```

## todos

- [ ] make sure touch is working on login on mobile
- [ ] add loading state to login while async auth-login attempts
- [ ] add loading state while processing login (takes a few moments)
- [ ] add logout?
- [ ] use browserify/webpack to minify and obfuscate source code
- [ ] add cloud functions validations to mitigate cheaters
- [ ] play with AI after 30 seconds of waiting
- [ ] store 1 entry per day per player
- [ ] reporting feature to dump data
- [ ] what else?
