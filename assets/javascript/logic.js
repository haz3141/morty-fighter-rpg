// import $ from 'jquery';

// Morty Constructor
class Morty {
    constructor(name, id, hp) {
        this.name = name;
        this.id = id;
        this.hp = hp;
    }
}

// Declare Mortys
c137 = new Morty('Morty C137', 'c137', 150);
lasagna = new Morty('Lasgna Morty', 'lasagna', 125);
punk = new Morty('Punk Morty', 'punk', 175);
zombie = new Morty('Zombie Morty', 'zombie', 200);

// Global Variables
let fighters = [c137, lasagna, punk, zombie];
let userSelected = false;
let defenderSelected = false;
let userMorty;
let defender;
let userID;
let defenderID;


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
    console.table(fighters[0].name);
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
            $('#fight-button').toggle();
            $('#enemies .morty-div').remove();

            defender.forEach((element) => {
                displayFighters('#defender', element.name, element.hp, element.id);
            });
            
            fighters.forEach((element) => {
                displayFighters('#enemies', element.name, element.hp, element.id);
            });
        }
    });
}



newGame();
clickMorty();
debug();

   
