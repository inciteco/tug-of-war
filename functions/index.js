'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// Keeps track of the length of the 'games'
exports.countGames = functions.database.ref('/games/{date}/{gameid}').onCreate(event => {
  const collectionRef = event.data.ref.parent;
  const countRef = functions.database.ref('/stats').child('total_games');

  return countRef.transaction(current => {
    if (event.data.exists() && !event.data.previous.exists()) {
      return (current || 0) + 1;
    }
    else if (!event.data.exists() && event.data.previous.exists()) {
      return (current || 0) - 1;
    }
  }).then(() => {
    console.log('Counter updated.');
  });
});

exports.recountGames = functions.database.ref('/stats/total_games').onWrite(event => {
  if (!event.data.exists()) {
    const counterRef = event.data.ref;
    const collectionRef = functions.database.ref('/games/{date}');

    return collectionRef.once('value')
        .then(gamesData => counterRef.set(gamesData.numChildren()));
  }
});
