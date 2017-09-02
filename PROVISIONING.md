## Run BigBoxCraveOff from scratch

Resurrection checklist:

## Setup Facebook

**Login to the [FB Dev Portal](developer.facebook.com) and:**
- [ ] Create a new app providing an app name (e.g. `Big Box Crave Off`)
- [ ] Add the product `Login` to this app, select `WWW`
- [ ] Enter the `site url` from the firebase app created (you can edit this later if you haven't done that yet)
- [ ] Follow the instructions that firebase will give you to add `oauth redirects` to this Facebook app.
- [ ] Add test users to the app under `Roles`

## Setup Firebase
We use Firebase Realtime Database, Database Rules, Cloud Functions, and Static Hosting. Here's how you set those up:

**Login to the [firebase console](https://console.firebase.google.com) and:**
- [ ] Create a new project
- [ ] Give it a project id (e.g. `bigboxcraveoff-staging`)
- [ ] From the project overview dashboard go to `authentication`
- [ ] Then click `sign-in methods`, enable `Email/Password` and `Facebook`
  - [ ] Provide the Facebook `app id`
  - [ ] Follow the instructions to add `oauth redirect urls` to Facebook app
- [ ] Repeat ^ for `dev`, `staging`, or `production` environments as desired
- [ ] Add users to each app for each developer

**Then do the following on each dev machine:**
- [ ] Follow the [quick-start instructions](README.md#quickstart) to pull down the project and setup `firebase-tools`
- [ ] Run `firebase login` and provide credentials that to any user with access to the firebase project
- [ ] Run `firebase init`, selecting default prompts
- [ ] Run `firebase use --add` select the project you just created
- [ ] Run `firebase deploy` and the app should deploy (may take minutes)

**Then update source code to point at the new apps:**

- [ ] update `prod_config` and `staging_config` in [GameService.js](public/js/services/GameService.js):**
- commit/push and all devs should be able to deploy the app now!
