// JavaScript Document
/** MockGameService
  *   @desc: mock library for multiplayer services
  */

function MockGameService (options) {

  // constants
  this.COUNTDOWN_SECONDS = 3; // Brett changed to 3 from 10 for testing
  this.GAMEPLAY_SECONDS = 45;

  // mappings for callbacks
  this.options = options || {};

  // shared state
  this.state = this.defaultState = {
    gameplayEndTimeout: null,
    gameplayStartTimeout: null,
    simulateOpponentMoveInterval: null,
    player: null,
    opponent: null,
    score: 0
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
    console.log('[MockGameService]', ...args);
  }

  // init!
  this.init = function () {
    this.log('init')
    this.state.player = {
      token:'secrettoken',
      // image: 'http://via.placeholder.com/200x200/00C/fff/?text=player',
      //name: 'you'
		
		// Brett changed for design/testing
		image: 'http://incitemagic.net/brs/phaser/popeyes/testingAssets/brs.jpg',
		name: 'Brett S.'
    }
  }

  // get the current player
  this.getPlayer = this.getMe = function () {
    return this.state.player;
  }

  // When we're ready for another player to join, call this
  this.findOpponent = function (forceFailure) {
    if (forceFailure) {
      // request cannot be made (assume connection problems, show try again button, etc...)
      return false;
    }

    // for now make a fake opponent
    const mockOpponent = {
     // image: 'http://via.placeholder.com/200x200/C00/fff/?text=player',
     // name: 'opponent'
		
		// Brett changed for design/testing
		image: 'http://incitemagic.net/brs/phaser/popeyes/testingAssets/sandy.jpg',
		name: 'Sandy F.'
    }

    // for now call it after 3 seconds
    setTimeout(_.bind(this.onOpponentArrived, this), 3000, mockOpponent);

    // request has been made, a user should arrive shortly
    return true;
  }

  this.getOpponent = function () {
    return this.state.opponent
  }

  // temp
  this.simulateOpponentMove = function () {
    // const randomMove = Math.round(Math.random() * 30);
      
	  // Brett version for now
	  const randomMove = Math.floor(Math.random()*26) - 15;
	  
	  this.onOpponentMove(randomMove);
  }

  this.makeMove = function (move) {
    this.log('sending my move to the server:', move);

    this.state.score += move;
  }

  this.endGame = function () {
    this.log('end game called');

    const playerWon = this.state.score > 0;
    this.onGameplayEnd(playerWon);
  }

  this.onConnectionError = function (error) {
    this.log('something went wrong:', error);

    // callback
    options.onConnectionError && options.onConnectionError(error);

    // emit
    this.emit('onConnectionError', {error: error});
  }

  this.onOpponentArrived = function (opponent) {
    this.log('remote player arrived:', opponent);

    this.state.opponent = opponent;

    // start the game in 10 seconds
    this.startCountdown(this.COUNTDOWN_SECONDS);

    // callback
    options.onOpponentArrived && options.onOpponentArrived(opponent);

    // emit
    this.emit('onOpponentArrived', opponent);
  }

  this.startCountdown = function (duration) {
    // emit
    this.onCountDownStart(duration);
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

    // callback
    options.onCountDownStart && options.onCountDownStart(secondsUntilStart);

    // emit
    this.emit('onCountDownStart', {secondsUntilStart: secondsUntilStart});
  }

  this.onGameplayStart = function () {
    this.log('onGameplayStart › user should start calling game.makeMove(<Number>) now');

    // let client cleanup state
    this.onLeavingCurrentState();

    // start simulating remote player
    clearInterval(this.state.simulateOpponentMoveInterval);
    this.state.simulateOpponentMoveInterval = setInterval(
      _.bind(this.simulateOpponentMove, this), 1300); // Brett changed from 500 to 1300

    // schedule the end of play
    clearTimeout(this.state.gameplayEndTimeout);
    this.state.gameplayEndTimeout = setTimeout(
      _.bind(this.endGame, this),
      this.GAMEPLAY_SECONDS * 1000);

    // callback
    options.onGameplayStart && options.onGameplayStart();

    // emit
    this.emit('onGameplayStart');
  }

  // gets called whenever remote player makes a move, the parameter is a positive integer (0 +)
  this.onOpponentMove = function (move) {
    // this.log('remote player moved:', move);

    this.state.score -= move;

    // callback
    options.onOpponentMove && options.onOpponentMove(move);

    // emit
    this.emit('onOpponentMove', move);
  }

  this.onGameplayEnd = function (userWon) {
    this.log('onGameplayEnd, user won?', userWon);

    // let client cleanup state
    this.onLeavingCurrentState();

    // cleanup
    this.reset();

    this.log('user should be taken to results screen');

    // callback
    options.onGameplayEnd && options.onGameplayEnd(userWon);

    // emit
    this.emit('onGameplayEnd', userWon);
  }

  this.onLeavingCurrentState = function () {
    // this.log('leaving current state, cleanup if needed...');

    // callback
    options.onLeavingCurrentState && options.onLeavingCurrentState();
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

// lazy way to make sure lodash is avilable
// TODO: use webpack for dependecy injection
try {
  _.bind(console.log, this);
} catch (e) {
  throw new Error('MockGameService requires lodash, check readme!')
}

// lazy way to make sure EventEmitter is avilable
// TODO: use webpack for dependecy injection
try {
  new EventEmitter()
} catch (e) {
  throw new Error('MockGameService requires EventEmitter, check readme!')
}