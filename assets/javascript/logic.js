// import $ from 'jquery';

// Morty Constructor
class Morty {
    constructor(name, id, hp, ap, cp) {
        this.name = name;
        this.id = id;
        this.hp = hp;
        this.ap = ap;
        this.cp = cp;
    }
}

// Declare Mortys
c137 = new Morty('Morty C137', 'c137', 150, 7, 25);
lasagna = new Morty('Lasgna Morty', 'lasagna', 125, 9, 7);
punk = new Morty('Punk Morty', 'punk', 175, 11, 9);
zombie = new Morty('Zombie Morty', 'zombie', 200, 9, 22);

// Global Variables
let fighters = [c137, lasagna, punk, zombie];
let userSelected = false;
let defenderSelected = false;
let userMorty;
let defender;
let userID;
let defenderID;
let baseAttackPower;
let enemiesDefeated = 0;

let ohJeez = new Audio('./assets/audio/oh_jeez.mp3');

// Starts a new game
function newGame() {
    
    // Display roster of Mortys
    fighters.forEach((element) => {
        displayFighters('#roster', element.name, element.hp, element.id);
    });
}

function debug() {
    console.table(c137);
    console.table(lasagna);
    console.table(punk);
    console.table(zombie);
    console.table(fighters);
    console.table(defender);
    console.table(userMorty);
}

// Function for rendering a Morty to the screen
function displayFighters(targetDiv, name, hp, id) {
    let newDiv = $('<div>');
    $(newDiv).attr({class: 'morty-div', id: id});
    let nameDiv = $('<p></p>').text(name);
    let hpDiv = $('<p></p>').text(hp);
    let imgDiv = $('<img>').attr({src: 'assets/images/' + id + '.png', height: '150px', id: id});
    $(newDiv).append(nameDiv).append(imgDiv).append(hpDiv);
    $(targetDiv).append(newDiv);
}

// Click a Morty
function clickMorty() {
    $('img').click(function() {

        if (!userSelected) {
            userSelected = true;
            userID = this.id;

            // Store user's Morty by removing from fighters array
            fighters.forEach((element, i) => {
                if (element.id === this.id) {
                    userMorty = fighters.splice(i, 1);
                }
            });

            // Store base attack power for later
            baseAttackPower = userMorty[0].ap;

            // Toggle appropriate divs
            $('#roster').toggle();
            $('#attacker').toggle();
            $('#enemies').toggle();

            // Display user Morty in attacker div
            userMorty.forEach((element) => {
                displayFighters('#attacker', element.name, element.hp, element.id);
            });

            // Display other Mortys in enemies div
            fighters.forEach((element) => {
                displayFighters('#enemies', element.name, element.hp, element.id);
            });

            // Start listening for clicks again
            pickAnOpponent();
            clickMorty();
        }

        if (userSelected && !defenderSelected && userID != this.id) {
            defenderSelected = true;
            defenderID = this.id;

            fighters.forEach((element, i) => {
                if (element.id === this.id) {
                    defender = fighters.splice(i, 1);
                }
            });

            // Toggle defender div and display Mortys
            $('#defender').toggle();
            $('#enemies .morty-div').remove();

            defender.forEach((element) => {
                displayFighters('#defender', element.name, element.hp, element.id);
            });

            fighters.forEach((element) => {
                displayFighters('#enemies', element.name, element.hp, element.id);
            });

            $('#messages').empty();
            fight();
        }
    });
}

function fight() {
    $('button').click(function() {
     
        if (defender[0] && userMorty[0].hp > 0 && defender[0].hp > 0) {

            userMorty[0].hp -= defender[0].cp;
            defender[0].hp -= userMorty[0].ap;
            let userRoundAP = userMorty[0].ap; //Save attack power before update for displaying message
            userMorty[0].ap += baseAttackPower;
            ohJeez.play();
            displayMessage('#messages', userMorty[0].name, defender[0].name, userRoundAP, defender[0].cp);
            ohJeez.play();
            updateBattle();
        } 
    });
}

function battleCheck() {
    
    if (defender[0].hp <= 0) {
        $('#defender .morty-div').remove();
        $('#defender').toggle();
        defender = [];
        defenderSelected = false;
        enemiesDefeated++;
        console.log(enemiesDefeated);
        if (enemiesDefeated === 3) {
            wonGame();
        }
        pickAnOpponent();
        clickMorty();
    } 
    
    if (userMorty[0].hp <= 0) {
        $('#attacker .morty-div').remove();
        userMorty.forEach((element) => {
            displayFighters('#attacker', element.name, 'DEAD', element.id);
            lostGame();
        });
    }
}

function updateBattle() {

    $('#attacker .morty-div').remove();
    $('#defender .morty-div').remove();

    userMorty.forEach((element) => {
        displayFighters('#attacker', element.name, element.hp, element.id);
    });

    defender.forEach((element) => {
        displayFighters('#defender', element.name, element.hp, element.id);
    });

    battleCheck();
}

function displayMessage(targetDiv, attacker, defender, attack, counter) {
    let newDiv = $('<p>').text(attacker + " hits " + defender + ' for ' + attack + ' HP. ' + defender + ' counters for ' + counter + ' HP.');
    $(targetDiv).empty();
    $(targetDiv).prepend(newDiv);
}

function lostGame() {
    $('#messages').html('<p>You Lost! Try Again.</p>');
    $('#fight-button').html('<button>TRY AGAIN!</button>');
    $('button').click(function() {
        window.location.reload();
    });
}

function wonGame() {
    $('#messages').html('<p>You Won! Play Again.</p>');
    $('#fight-button').html('<button>PLAY AGAIN!</button>');
    $('button').click(function() {
        window.location.reload();
    });
}

function pickAnOpponent() {
    if (enemiesDefeated !== 3) {
        let newDiv = $('<p>').text('Pick an opponent!');
        $('#messages').empty();
        $('#messages').prepend(newDiv);
    }
}


newGame();
clickMorty();