// Define game version
const version = "1.0.0";

// DOM elements
const consoleElement = document.getElementById("log");
const inputElement = document.getElementById("input");

// Add confirmation dialog when leaving the page
window.onbeforeunload = function() {
  return "But you just got here; stay a while.";
};

// Scroll to the bottom of the console
function scrollToBottom(elementId) {
  var element = document.getElementById(elementId);
  element.scrollTop = element.scrollHeight;
}

// Log messages to the console
function log(message, color = "white") {
  let p = document.createElement("p");
  p.innerHTML = message;
  p.style.color = color;
  consoleElement.appendChild(p);
  scrollToBottom("log");
}

// Initialize game
function initializeGame() {
  log("Starting BRYAN...", "white");
  log(`Loaded BRYAN Version ${version}`, "#3cc5cf");
  log(`You can't beat me, mere mortal!`, "#de3549");
  updateGameState();
}

// Define game characters
const bryan = {
  health: 10000,
  attackRange: [0, 15],
  healRange: [0, 10]
}

const player = {
  health: 100,
  attackRange: [1, 80],
  healRange: [2, 20]
}

// Flag to track if the game is ongoing
let gameInProgress = true;

function handleClick() {
  location.reload();
}

// Process user input
function processInput() {
  if (!gameInProgress) {
    log(`The game is over. You cannot take any actions. Press <button onclick="location.reload()">[Restart]</button> if you wish to play again.`, "red")
    const restart = document.getElementById('restart');
    restart.style.display = "block";
    return;
  }

  if (player.health <= 0) {
    log("You have been defeated!", "red");
    gameInProgress = false;
    return;
  }

  if (bryan.health <= 0) {
    log("Bryan has been defeated!", "green");
    gameInProgress = false;
    return;
  }

  const userInput = inputElement.value.trim().toLowerCase();
  if (userInput === "1" || userInput === "attack") {
    // Player attacks
    playerAttack();
  } else if (userInput === "2" || userInput === "heal") {
    // Player heals
    playerHeal();
  } else if (userInput === "r" || userInput === "restart") {
    location.reload();
  } else {
    // Invalid input
    log("Invalid input!", "red");
    return; // Don't count invalid input as a turn
  }
  inputElement.value = "";
  updateGameState();
}

// Player attacks
function playerAttack() {
  const attackDamage = Math.floor(Math.random() * (player.attackRange[1] - player.attackRange[0] + 1) + player.attackRange[0]);
  log(`B> You attack for ${attackDamage} points!`, "white");

  // Apply damage to Bryan
  bryan.health -= attackDamage;

  // Ensure player health doesn't drop below zero
  if (bryan.health < 0) {
    bryan.health = 0;
  }
}

// Player heals
function playerHeal() {
  const healAmount = Math.floor(Math.random() * (player.healRange[1] - player.healRange[0] + 1) + player.healRange[0]);
  let actualHeal = healAmount;
  if (player.health + healAmount > 100) {
    actualHeal = 100 - player.health;
    player.health = 100;
    log(`B> You healed but had 100 hp!`, "yellow");
  } else {
    player.health += healAmount;
  }
  if (actualHeal !== healAmount) {
    log(`B> You healed for ${healAmount} points but only applied ${actualHeal}!`, "yellow");
  } else {
    log(`B> You healed for ${healAmount} points!`, "white");
  }
}

// Flag to track if it's the player's first move
let isFirstPlayerMove = true;

// Update game state
function updateGameState() {
  if (bryan.health <= 0) {
    log("Bryan has been defeated!", "green");
    gameInProgress = false;
    return; // Don't continue the game if Bryan is defeated
  }

  if (player.health <= 0) {
    player.health = 0; // Ensure player health doesn't go negative
    log("You have been defeated!", "red");
    gameInProgress = false;
    return; // Don't continue the game if player is defeated
  }

  if (!isFirstPlayerMove) {
    // Bryan's turn
    bryanTurn();
  } else {
    isFirstPlayerMove = false;
  }

  // Player's turn or game over message
  log("Bryan Health: " + numberWithCommas(bryan.health), "#de3549");
  log("Your Health: " + player.health, "#40e651");

  if (gameInProgress) {
    if (!isFirstPlayerMove) {
      log("What do you want to do?", "#c56eff");
      log("1. Attack", "#c56eff");
      log("2. Heal", "#c56eff");
    } else {
      log("It's your turn! What do you want to do?", "#c56eff");
      log("1. Attack", "#c56eff");
      log("2. Heal", "#c56eff");
    }
  } else {
    log(`The game is over. You cannot take any actions. Type "r" or restart to try again.`, "red");
  }
}

// Bryan's turn
function bryanTurn() {
  const bryanDecision = Math.random();
  if (bryanDecision < 0.5 && bryan.health <= 50) {
    // Bryan heals
    bryanHeal();
  } else {
    // Bryan attacks
    bryanAttack();
  }
}

// Bryan heals
function bryanHeal() {
  const healAmount = Math.floor(Math.random() * (bryan.healRange[1] - bryan.healRange[0] + 1) + bryan.healRange[0]);
  bryan.health += healAmount;
  if (bryan.health > 100) {
    bryan.health = 100;
  }
  log(`Bryan heals for ${healAmount} points!`, "white");
}

// Bryan attacks
function bryanAttack() {
  const damageAmount = Math.floor(Math.random() * (bryan.attackRange[1] - bryan.attackRange[0] + 1) + bryan.attackRange[0]);
  player.health -= damageAmount;
  log(`Bryan attacks for ${damageAmount} points!`, "white");
  log(`You take ${damageAmount} points of damage!`, "#de3549");
}

// Format numbers with commas
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Event listener for Enter key press
inputElement.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    processInput();
  }
});

// Initialize game on load
initializeGame();