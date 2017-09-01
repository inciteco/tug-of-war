/* eslint-disable */

/** GameService
  *   @desc: multiplayer services library
  */

// TODO: remove this before releasing
window.firebase = firebase

const prod_config = {
  apiKey: 'AIzaSyCMRpOnvvm5cZXBkWei4hajlHxI_WJ7BLg',
  authDomain: 'popeyes-tug-o-war.firebaseapp.com',
  databaseURL: 'popeyes-tug-o-war.firebaseio.com',
  storageBucket: 'gs://popeyes-tug-o-war.appspot.com',
  messagingSenderId: '22295978007'
};

const staging_config = {
  apiKey: 'AIzaSyBnclObbA_Pf8gT5LfoIKXVH1tlDpDdhGQ',
  authDomain: 'popeyes-bigboxcraveoff-staging.firebaseapp.com',
  databaseURL: 'popeyes-bigboxcraveoff-staging.firebaseio.com',
  storageBucket: 'gs://popeyes-bigboxcraveoff-staging.appspot.com',
  messagingSenderId: '309004443218'
}

const on_local = document.location.hostname.includes('localhost');
const on_ngrok = document.location.hostname.includes('ngrok');
const on_staging = document.location.hostname.includes('staging');
const use_staging = on_local || on_ngrok || on_staging;
const config_to_use = use_staging ? staging_config : prod_config;

firebase.initializeApp(config_to_use);

function GameService (enableLogging) {

  // constants
  this.MAX_LIVE_PLAYER_WAIT_SECONDS = 10;
  this.STALE_GAME_TIMEOUT_SECONDS = 90;
  this.COUNTDOWN_SECONDS = 5;
  this.GAMEPLAY_SECONDS = 45;
  this.WINNING_SCORE_THRESHOLD = 100;
  this.STATIC_PATH = 'assets/images/';

  // bot opponent
  this.BOT_ENABLED = false;
  this.BOT_NAME = 'Annie';
  this.BOT_KEY = '-annie-bot-';
  this.BOT_IMAGE = this.STATIC_PATH + 'botAnnie.png';
  this.BOT_MOVE_MAX = 7;
  this.BOT_MOVE_SECONDS_BETWEEN_MOVES = 1;

  // shared state
  this.defaultState = {
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
    gameSession: null
  }

  this.state = JSON.parse(JSON.stringify(this.defaultState));

  // init!
  this.init = function () {
    this.log('init for', (on_local || on_staging) ? 'staging' : 'production');

    this.database = firebase.database();

    // TODO: make sure this isn't called too quickly?!
    // ensure a fresh emitter for each session
    this.emitter = new EventEmitter();

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

              const lastInitial = lastName.charAt(0);
              const update = {
                displayName: firstName + ' ' + lastInitial + '.',
                photoURL: photoURL
              };

              player.updateProfile(update)
                .then(_.bind(function() {
                  this.log('success updating profile!');
                  this.onPlayerReady(player);
                }, this))
                .catch(_.bind(function(error) {
                  this.log(
                    'something went wrong while updating profile!',
                    update);
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
    gameSessionDoc.on('value', this.boundGameUpdate);

    this.state.gameSession = gameSessionDoc;
    this.emit('onGameSessionStarted', this.state.gameSession);

    this.setupDisconnectAction();

    // warn the user before leaving while playing
    window.onbeforeunload = function() { return true; }
  }

  this.setupDisconnectAction = function () {
    this.log('setupDisconnectAction');
    if (!this.state.gameSession) {
      this.log('setupDisconnectAction aborted! no gameSession found...');
      return;
    }

    // setup remote disconnect callback
    const disconnectUpdate = {};
    const playingAsPlayer1 = this.state.player_is_host;

    if (playingAsPlayer1) {
      disconnectUpdate.player_1_connected = false;
      disconnectUpdate.player_2_score = 0;
      disconnectUpdate.player_2 = {
        key: 'n/a',
        name: 'n/a',
        image: 'n/a'
      };
    } else {
      disconnectUpdate.player_2_connected = false;
    }

    this.state.gameSession.onDisconnect()
      .update(disconnectUpdate)
      .then(_.bind(function () {
        this.log('done setting up up disconnect callback');
      }, this))
      .catch(_.bind(function(error) {
        this.log('something went wrong setting up disconnect!', error);
        this.log('trying again in 2 seconds');
        clearTimeout(this.state.setupDisconnectActionTimeout);
        const timeoutId = setTimeout(_.bind(function () {
            this.setupDisconnectAction();
          }, this), 2000);
        this.state.setupDisconnectActionTimeout = timeoutId;
      }, this));

  }


  this.endGameSession = function() {
    this.log('endGameSession');
    this.state.gameSession.off('value', this.boundGameUpdate);
    this.state.gameSession.onDisconnect().cancel();
  }

  this.gameUpdate = function (game) {
    this.log('gameUpdate', game.val());

    game = game.val();

    if (!game) {
      this.log('game does not exist!');
      return;
    }

    if (this.checkGameEnded(game)) {
      this.log('game has ended, aborting updates!');
      return;
    }

    this.checkForOpponentArrived(game);
    this.checkIfOpponentDisconnected(game);
    this.checkIfStartScheduled(game);
    this.setScore(game);
    this.checkScoreThresholdReached(game);

    this.state.gameSessionSnapshot = game;
  }
  this.boundGameUpdate = _.bind(this.gameUpdate, this);

  this.setScore = function (game) {

    if (Math.abs(game.player_1_score)==0 &&
    	  Math.abs(game.player_2_score)==0) {
      this.log('no scores found yet');
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

    if (this.hasGameBeenEnded()) {
      this.log('game was already ended');
      return true;
    }

    this.state.gameSessionSnapshot = game;

    const playerWon = game.game_winner == this.state.player.key;
    this.log('game has ended! playerWon:', playerWon);

    this.clearAllTimers();
    this.onGameplayEnd(playerWon);
    this.endGameSession();

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

  this.checkIfOpponentDisconnected = function (game) {
    const playingAsPlayer1 = this.state.player_is_host;

    if (game.player_1_connected==false ||
        game.player_2_connected==false) {
      this.opponentDisconnected();
    }
  }

  this.opponentDisconnected = function () {
    this.log('opponent disconnected! Ending game...');
    this.endGame(true);
  }

  this.checkIfStartScheduled = function (game) {
    const scheduleExistsLocally = this.state.game_start_time;
    const scheduleExistsRemotely = game.game_start_time;

    this.log('checkIfStartScheduled', 'scheduleExistsLocally', scheduleExistsLocally);
    this.log('checkIfStartScheduled', 'scheduleExistsRemotely', scheduleExistsRemotely);

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

  this.addListener = function (event, callback) {
    this.emitter.addListener(event, callback);
  }

  this.removeListener = function (event, callback) {
    this.emitter.removeListener(event, callback);
  }

  this.emit = function(type) {
    var args = Array.prototype.slice.call(arguments, 1);
    this.emitter.emitEvent.apply(this.emitter, [type, args]);
  }

  // util to keep things clean
  this.log = function () {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 0, '[GameService]');
    console.log.apply(this, args);
  }

  this.findOpponent = function (forceFailure) {
    this.log('findOpponent');

    // TODO: find a better way to ensure player exists
    if (!this.state.player) {
      this.log('findOpponent rescheduled without player');

      clearTimeout(this.state.findOpponentTimeout);
      this.state.findOpponentTimeout = setTimeout(
        _.bind(this.findOpponent, this), 2000);
      return;
    }

    this.findExistingGame();
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

            // // don't join a stale game
            // const now = new Date();
            // const startedAt = new Date(Date.parse(game.player_1_joined_at));
            // const gameAge = now.getTime() - startedAt.getTime();
            // const secondsSinceGameStarted = gameAge / 1000;
            //
            // if (secondsSinceGameStarted > this.STALE_GAME_TIMEOUT_SECONDS) {
            //   this.log('game is stale!', game);
            //   this.log('starting a new new game instead...');
            //
            //   this.createNewGame();
            //   return;
            // }

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
    const update = {
      player_2: this.state.player,
      player_2_score: 0,
      player_2_joined_at: now_ts,
      player_2_connected: true
    };

    gameDoc.update(update)
      .then(_.bind( function () {
        this.log('joined', gameId);
        this.state.player_is_host = false;
        this.startGameSession(gameDoc);
      }, this))
      .catch(_.bind(function(error) {
        this.log('error joining', error, update);

        // TODO: limit the number of attempts?

        this.log('looking for another game...');
        this.findExistingGame();
      }, this));
  }

  this.createNewGame = function () {
    this.log('createNewGame');

    const now_ts = new Date().toISOString();
    const doc_id = 'games/' + now_ts.split('T')[0] + '/';
    const gameSessionDoc = this.database.ref(doc_id).push();

    const doc = {
      player_1: this.state.player,
      player_1_score: 0,
      player_1_joined_at: now_ts,
      player_1_connected: true
    };

    gameSessionDoc.set(doc)
      .then(_.bind(function () {
        this.log('createNewGame done! game.key:', gameSessionDoc.key);

        // set this before first gameUpdate
        this.state.player_is_host = true;

        // start game updates
        this.startGameSession(gameSessionDoc);

        if (this.BOT_ENABLED) {
          // schedule simulated opponent check
          clearTimeout(this.state.switchToSimulatedOpponentTimeout);

          const timeoutId = setTimeout(
            _.bind(this.switchToSimulatedOpponent, this),
            this.MAX_LIVE_PLAYER_WAIT_SECONDS * 1000);

          this.state.switchToSimulatedOpponentTimeout = timeoutId;
        }
      }, this))
      .catch(_.bind(function(error) {
        this.log('something went wrong while creating game!', error, doc);

        // TODO: "something went wrong? <try again>?
      }, this));
  }

  this.switchToSimulatedOpponent = function () {
    const waitingForOpponent = !this.state.opponent;
    if (!waitingForOpponent)
      return;

    this.log('switching to simulated opponent');

    const simulatedOpponent = {
      key: this.BOT_KEY,
      image: this.BOT_IMAGE,
      name: this.BOT_NAME,
    }

    const now_ts = new Date().toISOString();
    const update = {
      player_2: simulatedOpponent,
      player_2_score: 0,
      player_2_joined_at: now_ts
    };

    this.state.gameSession.update(update)
      .then(_.bind(function () {
        this.log('done switched the game to simulated!');
      }, this))
      .catch(_.bind(function(error) {
        this.log('error switching to simulated game', error, update);
        // TODO: handle?
      }, this));

    return true;
  }

  this.getOpponent = function () {
    return this.state.opponent
  }

  this.getSecondsRemaining = function () {
    if (!this.state.game_end_time) {
      this.log('no end time scheduled yet!');
      return this.GAMEPLAY_SECONDS;
    }

    if (this.hasGameBeenEnded()) {
      return 0;
    }

    const now = new Date();
    const ends = new Date(Date.parse(this.state.game_end_time));
    const secondsRemaining = (ends.getTime() - now.getTime()) / 1000;

    return secondsRemaining;
  }

  this.hasGameBeenEnded = function () {
    const gameSessionSnapshot = this.state.gameSessionSnapshot;

    if (!gameSessionSnapshot) {
      return true;
    }

    return gameSessionSnapshot.game_ended == true;
  }

  this.simulateOpponentMove = function () {
    if (this.hasGameBeenEnded()) {
      this.log('move aborted! game has been ended');
      return;
    }

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
      .catch(_.bind(function(error) {
        this.log('something went wrong while simulating move!', error, update);
      }, this));
  }

  this.makeMove = function (move) {
    this.log('sending my move to the server:', move);

    if (this.hasGameBeenEnded()) {
      this.log('move aborted! game has been ended');
      return;
    }

    move = Math.round(move);

    const secondsRemaining = this.getSecondsRemaining();
    if (secondsRemaining < 0) {
      this.log('move aborted, game should be over');
      return;
    } else {
      this.log('move allowed', secondsRemaining, 'seconds remaining');
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
      .catch(_.bind(function(error) {
        this.log('something went wrong while making move!', update);
      }, this));
  }

  this.endGame = function (opponentDisqualified) {
    this.log('endGame called');

    clearTimeout(this.state.gameplayEndTimeout);

    const playingAsPlayer1 = this.state.player_is_host;
    const finalGameState = this.state.gameSessionSnapshot;
    const finalScore = playingAsPlayer1 ?
      finalGameState.player_1_score - finalGameState.player_2_score:
      finalGameState.player_2_score - finalGameState.player_1_score;

    const playerWonByHigherScore = finalScore > 0;
    const tieGame = finalScore==0;
    var playerMovedLast = false;
    if (tieGame) {
      playerMovedLast =
           (playingAsPlayer1 && finalGameState.last_to_move==1)
       || (!playingAsPlayer1 && finalGameState.last_to_move==2)
    }

    const playerWon = opponentDisqualified ||
      tieGame ? playerMovedLast : playerWonByHigherScore;

    if (opponentDisqualified) {
      this.log('player won due to disqualified opponent');
    } else {
      this.log('final game state:');
      this.log('- finalScore?:', finalScore);
      this.log('- tie?:', tieGame);
      this.log('- playingAsPlayer1?:', playingAsPlayer1);
      this.log('- finalGameState.last_to_move?:', finalGameState.last_to_move);
      this.log('- playerWon?:', playerWon);
    }

    const now_ts = new Date().toISOString();
    const update = {
      finalScore: finalScore,
      game_ended: true,
      game_ended_at: now_ts,
      game_winner: playerWon ? this.state.player.key : this.state.opponent.key,
      game_winner_was_host: playerWon
    };

    this.state.gameSession.update(update)
      .then(_.bind(function () {
        this.log('game conclusion saved!');
      }, this))
      .catch(_.bind(function(error) {
        this.log('something went wrong saving game conclusion!', update);
      }, this));
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

    const endAt = new Date(startAt.getTime() + this.GAMEPLAY_SECONDS * 1000);

    const duration = (endAt-startAt)/1000;

    this.log('schedule startAt', startAt);
    this.log('schedule endAt', endAt);
    this.log('schedule duration', duration, 'seconds');

    if (duration < this.GAMEPLAY_SECONDS) {
      this.log('short game found!');
    }
    const update = {
      game_start_time: startAt.toISOString(),
      game_end_time: endAt.toISOString()
    };

    this.state.gameSession.update(update)
      .then(_.bind(function () {
        this.log('start scheduled');
      }, this))
      .catch(_.bind(function(error) {
        this.log('something went wrong saving schedule!', error, update);
      }, this));
  }

  // params:
  //  - startTime is a date object that represents
  //    the UTC time after which player moves will be allowed
  this.onCountDownStart = function (secondsUntilStart) {
    this.log('countdown started, seconds remaining:', secondsUntilStart);

    // schedule the start of the game
    clearTimeout(this.state.onGameplayStartTimeout);
    this.state.onGameplayStartTimeout = setTimeout(
      _.bind(this.onGameplayStart, this),
      secondsUntilStart * 1000);

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

    // set a timer to fire at the scheduled end of play
    // TODO:  account for latency
    const secondsRemaining = this.getSecondsRemaining();

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

    this.log('user should be taken to results screen');

    // emit
    this.emit('onGameplayEnd', userWon);
  }

  this.onLeavingCurrentState = function () {
    // this.log('leaving current state, cleanup if needed...');

    this.emit('onLeavingCurrentState');
  }

  this.clearAllTimers = function () {
    this.log('clearAllTimers');

    clearInterval(this.state.simulateOpponentMoveInterval);
    clearTimeout(this.state.switchToSimulatedOpponentTimeout);
    clearTimeout(this.state.gameplayEndTimeout);
    clearTimeout(this.state.findOpponentTimeout);
    clearTimeout(this.state.setupDisconnectActionTimeout);
  }

  this.reset = function () {
    this.log('resetting...');

    // stop timers
    this.clearAllTimers();

    // reset state
    this.state = JSON.parse(JSON.stringify(this.defaultState));

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
