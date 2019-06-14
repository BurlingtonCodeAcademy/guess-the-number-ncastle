/**
 *  Week 1 BCA project:
 *    Guessing game in which the roles are reversed and
 *    the computer picks a number and the user guesses.
 *  Author: Nick Castle
 *  Start Date: 06/07/2019
 */

// boilerplate code for readline library
const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
// end readline setup

// function containing the game logic
async function startGame() {
  // variables & constants
  let MAX = 100;
  if (process.argv[2]) MAX = process.argv[2];
  let MIN = 0;
  let currHigh = MAX;
  let currLow = MIN;
  let userGuess;
  let numGuesses = 0;
  let compNum;    // holds the computer's number
  let found = false;

  // log intro message
  console.log(`I will pick a number between ${MIN} and ${MAX}.`);
  console.log(`Try to guess my number in as little tries as possible!`);

  // get random number for computer
  compNum = randomInteger(MIN, MAX);
  console.log(`Computer Num: ${compNum}`);

  // main while loop
  // while number is not found, user makes a guess
  while (!found) {

    // prompt user to guess
    // parseInt from user input to get a number instead of a string
    userGuess = parseInt(await ask(`Make a guess! `));
    numGuesses++;   // increment number of guesses
    console.log(`user guess: ${userGuess} ${typeof userGuess}`);


    // make sure user guesses a number
    while (typeof(userGuess) !== 'number') {
      console.log(`Enter a number please!`);
      userGuess = parseInt(await ask(`Make a guess!`));
    }

    // make sure user guesses within the range
    while (userGuess > currHigh || userGuess < currLow) {
      if (userGuess > currHigh) console.log(`Hey, I already told you that my number is lower than ${currHigh + 1}!`);
      if (userGuess < currLow) console.log(`Hey, I already told you my number is higher than ${currLow - 1}`);
      userGuess = parseInt(await ask(`Make a guess! `));
    }

    // if user guesses number correctly
    if (userGuess == compNum) {
      found = true;
      console.log(`You guessed it in ${numGuesses} guesses!`);
    } else if (userGuess > compNum) {   // if userGuess is greater than the computer's number
      console.log(`You guessed ${userGuess}, that's WRONG!`);
      console.log(`My number is LOWER than your guess`);
      currHigh = userGuess - 1;   // subtract one from userGuess to get the updated highest possible value
      console.log("currHigh: ", currHigh);
    } else if (userGuess < compNum) {      // else userGuess is less than the computer's number
      console.log(`You guessed ${userGuess}, that's WRONG!`)
      console.log(`My number is HIGHER than your guess`);
      currLow = userGuess + 1;    // add one to userGuess to get the updated lowest possible value
      console.log("currLow: ", currLow);
    } else {
      console.log("That's not a number!");
      numGuesses--;   // decrement number of guesses to account for bad input
    }
    
  }

  process.exit();
}

// call startGame() to start the game
startGame();

// helper functions

// function to get a random integer in a range from min to max (inclusive)
function randomInteger(min, max) {
  let range = max - min + 1;
  return min + Math.floor(Math.random() * range);
}