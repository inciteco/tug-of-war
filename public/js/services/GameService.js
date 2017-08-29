/* eslint-disable */

/** GameService
  *   @desc: multiplayer services library
  */

// TODO: remove this before releasing
window.firebase = firebase

firebase.initializeApp({
  apiKey: 'AIzaSyCMRpOnvvm5cZXBkWei4hajlHxI_WJ7BLg',
  authDomain: 'popeyes-tug-o-war.firebaseapp.com',
  databaseURL: 'popeyes-tug-o-war.firebaseio.com',
  storageBucket: 'gs://popeyes-tug-o-war.appspot.com',
  messagingSenderId: '22295978007'
})

function GameService (enableLogging) {

  // constants
  this.MAX_LIVE_PLAYER_WAIT_SECONDS = 10;
  this.COUNTDOWN_SECONDS = 10;
  this.GAMEPLAY_SECONDS = 60;
  this.WINNING_SCORE_THRESHOLD = 100;
  this.STALE_GAME_TIMEOUT = 90;
  this.STATIC_PATH = 'assets/images/';

  // bot opponent
  this.BOT_NAME = 'Annie';
  this.BOT_KEY = '-annie-bot-';
  this.BOT_IMAGE = this.STATIC_PATH + 'botAnnie.png';
  this.BOT_MOVE_MAX = 7;
  this.BOT_MOVE_SECONDS_BETWEEN_MOVES = 1;

  // shared state
  this.state = this.defaultState = {
    gameplayEndTimeout: null,
    gameplayStartTimeout: null,
    simulateOpponentMoveInterval: null,
    player: null,
    player_is_host: null,
    opponent: null,
    opponent_simulated: false,
    game_start_time: null,
    game_end_time: null,
    player_1_score: 0,
    player_2_score: 0,
    score: 0,
    gameDoc: null
  }

  // init!
  this.init = function () {
    this.log('init')

    this.database = firebase.database();

    // wait for async player auth
    if (firebase.auth().currentUser) {
      this.authStateChanged(firebase.auth().currentUser);
    } else {
      firebase.auth().onAuthStateChanged(
        _.bind(this.authStateChanged, this));
    }
  }

  this.signInWithEmail = function (email, firstName, lastName) {
    this.log('signIn', email, firstName, lastName);

    const auth = firebase.auth();
    const password = 'password';

    auth.signInWithEmailAndPassword(email, password)
      .then(_.bind(function(error) {
        this.log('success signing in with email', email);
        // TODO:
        // - update profile's DisplayName
        // - then emit for a redirect?
      }, this))
      .catch(_.bind(function(error) {
        if (error.code === "auth/user-not-found") {
          this.log('user doesn\'t exist yet! creating...');

          auth.createUserWithEmailAndPassword(email, password)
            .then(_.bind(function(player) {
              this.log('success signing up with email', player);
              this.log('updating profile...');

              const photoURL = this.getRandomAvatar();
              this.log('getRandomAvatar', photoURL);

              player.updateProfile({
                displayName: firstName + ' ' + lastName,
                photoURL: photoURL
              }).then(_.bind(function() {
                this.log('success updating profile!');
                this.onPlayerReady(player);
              }, this)).catch(_.bind(function(error) {
                this.log('something went wrong while updating profile!');
              }), this);
            }, this))
            .catch(_.bind(function(error) {
              this.log('error signing up with email', error);
            }, this));
        } else {
          this.log('error signing in with email', error);
        }
      }, this));
  }

  this.getRandomAvatar = function () {
    const randomNumber = 1 + Math.round(Math.random() * 7);
    const paddedRandomNumber = String(randomNumber).padStart(2, "0");
    const randomAvatar = 'nonFBPlayerPics_'+paddedRandomNumber+'.png';

    this.log('random avatar', randomAvatar);

    return this.STATIC_PATH + randomAvatar;
  }

  this.signInWithFacebook = function (email, firstName, lastName) {
    this.log('signInFacebook', email, firstName, lastName);

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');

    firebase.auth().signInWithRedirect(provider);
  }

  this.signOut = function () {
    this.log('signOut');
    firebase.auth().signOut();
  }

  this.authStateChanged = function (user) {
    if (user) {
      if (!user.displayName) {
        this.log('no displayName set, aborting!');
        return;
      }
      this.setPlayer({
        key: user.uid,
        image: user.photoURL,
        name: user.displayName
      });
    } else {
      this.setPlayer(null);
    }
  }

  this.setPlayer = function(player) {
    this.log('setPlayer', player);

    this.state.player = player;

    this.onPlayerReady(player);
  }

  this.setOpponent = function(opponent) {
    this.log('setOpponent', opponent);
    this.state.opponent = opponent;

    if (opponent.key == this.BOT_KEY) {
      this.state.opponent_simulated = true;
    }

    // notify
    this.onOpponentArrived(opponent);

    // start the game in 10 seconds
    this.setGameSchedule()
  }

  // get the current player
  this.getPlayer = this.getMe = function () {
    return this.state.player;
  }

  this.startGameSession = function(gameSessionDoc) {
    this.log('startGameSession', gameSessionDoc);

    // TODO: more graceful transition?
    if (this.state.gameSession) {
      throw new Error('gameSession already started!')
      return;
    }

    // start listening
    gameSessionDoc.on('value', _.bind(this.gameUpdate, this));

    this.state.gameSession = gameSessionDoc;
    this.emit('onGameSessionStarted', this.state.gameSession);

    // warn the user before leaving while playing
    window.onbeforeunload = function() { return true; }
  }

  this.gameUpdate = function (game) {
    this.log('gameUpdate', game.val());

    game = game.val();
    this.state.lastSnapshot = game;

    if (!game) {
      this.log('game does not exist!');
      return;
    }

    if (this.checkGameEnded(game)) {
      this.log('game has ended!');
      return;
    }

    this.checkForOpponentArrived(game);
    this.checkIfStartScheduled(game);
    this.setScore(game);
    this.checkScoreThresholdReached(game);
  }

  this.setScore = function (game) {

    if (Math.abs(game.player_1_score)==0 &&
    	  Math.abs(game.player_2_score)==0) {
      this.log('no score found yet');
	    return;
    }

    const playingAsPlayer1 = this.state.player_is_host;

    const playerMoveAmount = playingAsPlayer1 ?
      game.player_1_score - this.state.player_score:
      game.player_2_score - this.state.player_score;

    const opponentMoveAmount = playingAsPlayer1 ?
      game.opponent_score - this.state.player_2_score:
      game.opponent_score - this.state.player_1_score;

    this.state.player_score = playingAsPlayer1 ?
      game.player_1_score :  game.player_2_score;

    this.state.opponent_score = playingAsPlayer1 ?
      game.player_2_score :  game.player_1_score;

    this.state.score = this.state.player_score - this.state.opponent_score;

    if (playerMoveAmount) {
      this.onPlayerMove(playerMoveAmount);
    }

    if (opponentMoveAmount) {
      this.onOpponentMove(opponentMoveAmount);
    }

    this.emit('onScoreChanged', this.state.score);
  }

  this.checkScoreThresholdReached = function (game) {
    if (game.game_ended) {
      return;
    }

    if (!this.state.player_is_host) {
      return;
    }

    if (isNaN(this.state.score)) {
      return;
    }

    if (Math.abs(this.state.score) < this.WINNING_SCORE_THRESHOLD) {
      return;
    }

    this.endGame();
  }

  this.checkGameEnded = function (game) {
    if (!game.game_ended) {
      return;
    }

    const playerWon = this.state.player_is_host ?
      game.game_winner_was_host:
      !game.game_winner_was_host;

    this.log('game has ended! playerWon:', playerWon);

    this.onGameplayEnd(playerWon);

    return true;
  }

  this.checkForOpponentArrived = function (game) {
    const playingAsPlayer1 = this.state.player_is_host;
    const waitingForOpponent = !this.state.opponent;

    if (!waitingForOpponent)
      return;

    if (!playingAsPlayer1) {
      this.setOpponent(game.player_1);
    } else {
      if (!game.player_2)
        return;

      this.setOpponent(game.player_2);
    }
  }

  this.checkIfStartScheduled = function (game) {
    const scheduleExistsLocally = this.state.game_start_time;
    const scheduleExistsRemotely = game.game_start_time;

    if (!scheduleExistsRemotely) {
      // no schedule yet!
      return;
    }

    if (scheduleExistsLocally) {
      // start already scheduled
      return;
    }

    this.state.game_start_time = game.game_start_time;
    this.state.game_end_time = game.game_end_time;

    this.log('schedule found!');

    // calculate this to account for latency
    const now = new Date();
    const starts = new Date(Date.parse(this.state.game_start_time));
    const diff = (starts.getTime() - now.getTime()) / 1000;
    this.startCountdown(diff);
  }

  this.emitter = new EventEmitter();

  this.addListener = function (event, callback) {
    this.emitter.addListener(event, callback);
  }

  this.removeListener = function (event, callback) {
    this.emitter.removeListener(event, callback);
  }

  this.emit = function(type, ...args) {
    this.emitter.emitEvent(type, args);
  }

  // util to keep things clean
  this.log = function (...args) {
    console.log('[GameService]', ...args);
  }

  this.findOpponent = function (forceFailure) {
    this.log('findOpponent');

    // TODO: find a better way to ensure player exists
    if (!this.state.player) {
      this.log('findOpponent rescheduled without player');
      setTimeout(_.bind(this.findOpponent, this), 2000);
      return;
    }

    this.findExistingGame()
  }

  this.findExistingGame = function () {
    this.log('findExistingGame');

    const now_ts = new Date().toISOString();
    const doc_id = 'games/' + now_ts.split('T')[0] + '/';
    const gameListRef = this.database.ref(doc_id)
      .orderByChild('player_2')
      .limitToFirst(1)

    gameListRef.once('value',
      _.bind(function(gamesRef) {
        if (!gamesRef.hasChildren()) {
          this.log('no games found, starting one...');
          return this.createNewGame();
        }

        gamesRef.forEach(
          _.bind(function(gameRef) {
            const game_key = gameRef.key;
            const game = gameRef.val();

            // no third-wheels allowed
            // TODO: do this after iterating a few options for a match?
            const gameNeedsOpponent = game.player_2 == null;
            if (!gameNeedsOpponent) {
              this.log('most recent game already has a player!');
              this.log('starting a new new game instead...');

              this.createNewGame();
              return;
            }

            // don't join a stale game
            const now = new Date();
            const gameAge = now.getTime() - Date.parse(game.player_1_joined_at)
            const secondsSinceGameStarted = gameAge / 1000;
            if (secondsSinceGameStarted > this.STALE_GAME_TIMEOUT) {
              this.log('game is stale!');
              this.log('starting a new new game instead...');

              this.createNewGame();
              return;
            }

            // must be good if we got here, let's join it
            const gameId = doc_id + game_key;
            this.joinExistingGame(gameId);
          }, this)
        )
      }, this)
    )
  }

  this.joinExistingGame = function (gameId) {
    this.log('joinExistingGame', gameId);

    const gameDoc = this.database.ref(gameId);
    const now_ts = new Date().toISOString();

    gameDoc.update({
      player_2: this.state.player,
      player_2_score: 0,
      player_2_joined_at: now_ts
    }).then(_.bind(function () {
      this.log('joined', gameId);
      this.state.player_is_host = false;
    }, this))

    this.startGameSession(gameDoc);
  }

  this.createNewGame = function () {
    this.log('createNewGame');

    const now_ts = new Date().toISOString();
    const doc_id = 'games/' + now_ts.split('T')[0] + '/';
    const gameSessionDoc = this.database.ref(doc_id).push();

    gameSessionDoc.set({
      player_1: this.state.player,
      player_1_score: 0,
      player_1_joined_at: now_ts
    }).then(_.bind(function () {
      this.log('createNewGame done! game.key:', gameSessionDoc.key);
    }, this))

    // set this before first gameUpdate
    this.state.player_is_host = true;

    setTimeout(_.bind(function () {
        console.log('done waiting for a live player');
        this.log('switching to simulated opponent');
        this.switchToSimulatedOpponent();
      }, this),
      this.MAX_LIVE_PLAYER_WAIT_SECONDS * 1000);

    // start game updates
    this.startGameSession(gameSessionDoc);
  }

  // fill the player_2 slot with a simulated player
  this.switchToSimulatedOpponent = function () {

    // for now make a fake opponent
    const simulatedOpponent = {
      key: this.BOT_KEY,
      image: this.BOT_IMAGE,
      name: this.BOT_NAME,
    }

    const now_ts = new Date().toISOString();
    this.state.gameSession.update({
      player_2: simulatedOpponent,
      player_2_score: 0,
      player_2_joined_at: now_ts
    }).then(_.bind(function () {
      this.log('switched game simulated on firebase');
    }, this));

    // request has been made, once the server aknowledges,
    // we will start the game via the standard watchers.
    return true;
  }

  this.getOpponent = function () {
    return this.state.opponent
  }

  // temp
  this.simulateOpponentMove = function () {
    const playingAsPlayer1 = this.state.player_is_host;
    const randomMove = Math.round(Math.random() * this.BOT_MOVE_MAX);
    const update = {};

    // opponent moves should be for opposite player!
    if (!playingAsPlayer1) {
      this.state.player_1_score += randomMove;
      update.player_1_score = this.state.player_1_score;
      update.last_to_move = 1;
    } else {
      this.state.player_2_score += randomMove;
      update.player_2_score = this.state.player_2_score;
      update.last_to_move = 2;
    }

    this.state.gameSession.update(update)
      .then(_.bind(function () {
        this.log('simulated move synced');
      }, this))
  }

  this.makeMove = function (move) {
    this.log('sending my move to the server:', move);

    // only use positive integers
    move = Math.round(Math.abs(move));

    const now = new Date();
    const ends = new Date(Date.parse(this.state.game_end_time));
    const diff = (ends.getTime() - now.getTime()) / 1000;

    if (diff < 0) {
      this.log('move aborted, game should be over');
      return;
    } else {
      this.log('move allowed', diff, 'seconds remaining');
    }

    const playingAsPlayer1 = this.state.player_is_host;
    const update = {};

    if (playingAsPlayer1) {
      this.state.player_1_score += move;
      update.player_1_score = this.state.player_1_score;
      update.last_to_move = 1;
    } else {
      this.state.player_2_score += move;
      update.player_2_score = this.state.player_2_score;
      update.last_to_move = 2;
    }

    this.state.gameSession.update(update)
      .then(_.bind(function () {
        this.log('move synced');
      }, this))
  }

  this.endGame = function () {
    this.log('endGame called');

    const playingAsPlayer1 = this.state.player_is_host;
    const finalGameState = this.state.lastSnapshot;
    const finalScore = playingAsPlayer1 ?
      finalGameState.player_1_score - finalGameState.player_2_score:
      finalGameState.player_2_score - finalGameState.player_1_score;

    const playerWonByHigherScore = finalScore > 0;
    const tieGame = finalScore==0;
    if (tieGame) {
      playerMovedLast = (playingAsPlayer1 && finalGameState.last_to_move==1)
       || (!playingAsPlayer1 && finalGameState.last_to_move==2)
    }

    const playerWon = tieGame ? playerMovedLast : playerWonByHigherScore;

    const now_ts = new Date().toISOString();
    this.state.gameSession.update({
      finalScore: finalScore,
      game_ended: true,
      game_ended_at: now_ts,
      game_winner: playerWon ? this.state.player.key : this.state.opponent.key,
      game_winner_was_host: playerWon
    }).then(_.bind(function () {
      this.log('game conclusion saved!');
    }, this))
  }

  this.onConnectionError = function (error) {
    this.log('something went wrong:', error);

    // emit
    this.emit('onConnectionError', {error: error});
  }

  this.onOpponentArrived = function (opponent) {
    this.log('remote player arrived:', opponent);

    // emit
    this.emit('onOpponentArrived', opponent);
  }

  this.onPlayerReady = function (player) {
    this.log('player ready:', player);

    // emit
    this.emit('onPlayerReady', player);
  }

  this.startCountdown = function (duration) {

    this.log('starting countdown as',
      this.state.player_is_host ? 'host' : 'client');

    // emit
    this.onCountDownStart(duration);
  }

  this.setGameSchedule = function() {

    if (!this.state.player_is_host) {
      // only host can schedule start
      this.log('only host can create schedule', this.state.player_is_host);
      return;
    }

    const now = new Date();

    const startAt = new Date();
    startAt.setSeconds(now.getSeconds()+this.COUNTDOWN_SECONDS);

    const endAt = new Date();
    endAt.setSeconds(startAt.getSeconds()+this.GAMEPLAY_SECONDS);

    this.state.gameSession.update({
      game_start_time: startAt.toISOString(),
      game_end_time: endAt.toISOString()
    })
      .then(_.bind(function () {
        this.log('start scheduled');
      }, this))
  }

  // params:
  //  - startTime is a date object that represents
  //    the UTC time after which player moves will be allowed
  this.onCountDownStart = function (secondsUntilStart) {
    this.log('countdown started, seconds remaining:', secondsUntilStart);

    // schedule the start of the game
    clearTimeout(this.state.onGameplayStartTimeout);
    this.state.onGameplayStartTimeout = setTimeout(
      _.bind(this.onGameplayStart, this), secondsUntilStart * 1000);

    // emit
    this.emit('onCountDownStart', {secondsUntilStart: secondsUntilStart});
  }

  this.onGameplayStart = function () {
    this.log('onGameplayStart › user should start calling game.makeMove(<Number>) now');

    // let client cleanup state
    this.onLeavingCurrentState();

    if (this.state.opponent_simulated) {
      // start simulating remote player
      clearInterval(this.state.simulateOpponentMoveInterval);
      this.state.simulateOpponentMoveInterval = setInterval(
        _.bind(this.simulateOpponentMove, this),
        this.BOT_MOVE_SECONDS_BETWEEN_MOVES * 1000);
    }

    // schedule the end of play
    // calculate this to account for latency
    const now = new Date();
    const ends = new Date(Date.parse(this.state.game_end_time));
    const secondsRemaining = (ends.getTime() - now.getTime()) / 1000;

    this.log('game end scheduled for', secondsRemaining, 'seconds from now');

    clearTimeout(this.state.gameplayEndTimeout);
    this.state.gameplayEndTimeout = setTimeout(
      _.bind(this.endGame, this),
      secondsRemaining * 1000);

    // emit
    this.emit('onGameplayStart', secondsRemaining);
  }

  // gets called whenever opponent move is synced from db
  // the parameter is a positive integer (0 +)
  this.onPlayerMove = function (move) {
    this.log('onPlayerMove:', move);
    this.emit('onPlayerMove', move);
  }

  // gets called whenever player move is synced from db
  // the parameter is a positive integer (0 +)
  this.onOpponentMove = function (move) {
    this.log('onOpponentMove:', move);
    this.emit('onOpponentMove', move);
  }

  this.onGameplayEnd = function (userWon) {
    this.log('onGameplayEnd, user won?', userWon);

    // let client cleanup state
    this.onLeavingCurrentState();

    // cleanup
    this.reset();

    this.log('user should be taken to results screen');

    // emit
    this.emit('onGameplayEnd', userWon);
  }

  this.onLeavingCurrentState = function () {
    // this.log('leaving current state, cleanup if needed...');

    this.emit('onLeavingCurrentState');
  }

  this.reset = function () {
    this.log('resetting...');

    // stop timers
    clearInterval(this.state.simulateOpponentMoveInterval);
    clearTimeout(this.state.gameplayEndTimeout);

    // reset state
    Object.assign(this.state, this.defaultState);

    // reinitialize
    this.init();

    // dont warn leaving users anymore
    window.onbeforeunload = null;

    this.log('reset complete!');
  }

  /* testConnection
   *    Confirm that we can connect to the multiplayer service
   *    If false is returned, show an error to users telling them to retry soon.
   */
  this.testConnection = function (forceFailure) {
    if (forceFailure) {
      return false;
    }

    return true;
  }

  // setup
  this.init();

  // export lib
  return this;
}
