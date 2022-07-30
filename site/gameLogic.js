import {Category} from "./categoriesSentences.js";
import {Audio} from "./audio.js";


const game = {
    finalStatus : null,
    currentSentence : null,
    currentSentenceLetters : null,
    currentCategory : null,
    attempts : 6,
    currentImage : document.querySelector("img"),
    elemSentence : document.querySelector(".game-sentence"),
    elemAttempts : document.querySelector(".game-attempts"),
    elemLetters : document.querySelector(".game-letters"),
    elemCategory : document.querySelector(".game-category"),
    elemStatus : document.querySelector(".game-status"),
    categories : Category.categories,
    audio : new Audio(),

    images : [
        "/sources/images/starting-point.png",
        "/sources/images/first-attempt.png",
        "/sources/images/second-attempt.png",
        "/sources/images/third-attempt.png",
        "/sources/images/fourth-attempt.png",
        "/sources/images/fifth-attempt.png",
        "/sources/images/sixth-attempt.png",
        "/sources/images/hangman-game-front.png"
    ],

    generateLetterButtons(){
        const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

        alphabet.forEach(letter => {
            const button = document.createElement("button");
            button.classList.add("game-letter");
            button.type = "button";
            button.dataset.letter = letter;
            button.innerText = letter;
            this.elemLetters.appendChild(button);
        });
    },

    lettersChecker(e){
        if(e.target.nodeName.toUpperCase() === "BUTTON" && e.target.classList.contains("game-letter")){
            const letter = e.target.dataset.letter;
            console.log(e.target);
            console.log(letter);
            game.checkLettersInSentence(letter.toUpperCase());
            e.target.disabled = true;
        }
    },

    bindEvents(){
        if(this.finalStatus == null){
            this.elemLetters.addEventListener("click", this.lettersChecker);
            console.log("lettersChecker added")
        } else {
            this.elemLetters.removeEventListener("click", this.lettersChecker);
            console.log("lettersChecker removed")
        };
    },

    disableLetters(){
        const letters = document.querySelectorAll(".game-letter");
        letters.forEach(letter => letter.disabled = true);
    },

    initBoard(){
        this.generateLetterButtons();
        this.bindEvents();
        console.log("board inited");
    },

    deleteBoard(){
        this.bindEvents();
        while (this.elemLetters.firstChild){
            this.elemLetters.firstChild.remove();
        }
        console.log("board deleted");
    },

    addCategory(){
        this.elemCategory.innerText = "Category: " + this.currentCategory;
    },

    deleteCategory(){
        this.elemCategory.innerText = "";
        console.log("category deleted");
    },

    showAttempts(){
        this.elemAttempts.innerText = "Attempts: " + this.attempts;
    },

    hideAttempts(){
        this.elemAttempts.innerText = "";
    },

    randomRange(min, max){
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    randomSentence(){
        let numberOfCategory = this.randomRange(0, this.categories.length-1);
        const randomCategory = this.categories[numberOfCategory];
        this.currentCategory = randomCategory;
        this.currentSentence = Category[randomCategory][this.randomRange(0, Category[randomCategory].length-1)].toUpperCase();
        this.currentSentenceLetters = this.currentSentence.replace(/ /g, "");
       

        this.elemSentence.innerText = "";

        const letters = this.currentSentence.split("");
        letters.forEach(letter => {
            const div = document.createElement("div");
            div.classList.add("game-sentence-box");
            if (letter === " ") {
                div.classList.add("game-sentence-box-space");
                div.innerText = " ";
            } else {
                div.innerText = "*";
            }
            this.elemSentence.appendChild(div);
        });
        console.log(letters);
    },

    clearSentence(){
        while (this.elemSentence.firstChild){
            this.elemSentence.firstChild.remove();
        }
        console.log("sentence cleared");
    },

    isLetterExist(){
        return this.currentSentenceLetters.length;
    },

    checkLettersInSentence(letter){
        if(this.currentSentence.includes(letter)){
            const lettersBox = document.querySelectorAll(".game-sentence-box");

            for(let i=0; i < this.currentSentence.length; i++){
                if(this.currentSentence[i] === letter){
                    lettersBox[i].innerText = letter;
                }
            }
            
            const letterRemoverd = new RegExp(letter, "g");
            this.currentSentenceLetters = this.currentSentenceLetters.replace(letterRemoverd, "");

            if (!this.isLetterExist()){
                // GAME WIN
                this.finalStatus = "Congratulatons!"
            }

        } else {
            this.attempts--;
            console.log("points reduced");
            this.showAttempts();
            this.currentImage.src = this.images[6-this.attempts];

            if (this.attempts <= 0){
                // GAME DEFEAT
                this.finalStatus = "Game defeated!";
                let letterIndex = 0;
                [...this.elemSentence.children].forEach(child => {
                    if (child.classList.contains("game-sentence-box")){
                        child.innerText = this.currentSentence[letterIndex];
                        letterIndex++;
                    }
                });
            }
        }

        if (this.finalStatus != null && this.finalStatus != "inGame"){
            this.addStatus();
            this.disableLetters();
        }    
    },

    addStatus(){
        const status = document.createElement("div");
        status.classList.add("game-status");
        status.innerText = this.finalStatus;
        this.elemStatus.appendChild(status);
        console.log("status updated");
    },

    deleteStatus(){
        while (this.elemStatus.firstChild){
            this.elemStatus.firstChild.remove();
        }
        console.log("status deleted");
    },


    startGame(){
        const startButton = document.querySelector("button.button.game-start");

        function gameMode(){
            console.dir(game.audio);
            game.attempts = 6;
            game.currentImage.src = game.images[0];
            startButton.innerText = "End game";
            game.showAttempts();
            game.initBoard();
            game.randomSentence();
            game.addCategory();
            console.log("start game");
            startButton.addEventListener("click", menuMode);
            startButton.removeEventListener("click", gameMode);
            game.finalStatus = "inGame";
            game.audio.playBackgroundSound();
        };

        function menuMode(){
            game.currentImage.src = game.images[7];
            game.deleteBoard();
            game.deleteCategory();
            game.hideAttempts();
            game.clearSentence();
            game.deleteStatus();
            startButton.innerText = "Start game";
            console.log("end game");
            startButton.addEventListener("click", gameMode);
            startButton.removeEventListener("click", menuMode);
            game.finalStatus = null;
            game.audio.stopBackgroundSound();
        };
        

        startButton.addEventListener("click", gameMode);
        startButton.addEventListener("click", game.audio.startButtonClick);
    }
};


game.startGame();
