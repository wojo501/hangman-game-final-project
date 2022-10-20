// import {Howl, Howler} from "howler";

 
const allAudio = [
    "/sources/sounds/background-driving_ambition.mp3",
    "/sources/sounds/letter.mp3",
    "/sources/sounds/start-button.mp3"
];

export class Audio{

    constructor(){
        this.backgroundSound = null;

        this.letterSound = new Howl({
            src : allAudio[1],
            loop : false,
        });

        this.startButtonSound = new Howl({
            src : allAudio[2],
            loop : false,
        });
    };
    
    playBackgroundSound(){
        if (this.backgroundSound === null){
            this.backgroundSound = new Howl({
                src : allAudio[0],
                loop : true,
                volume : 0.1,
            });
        }
        console.dir(this.backgroundSound);
        this.backgroundSound.play();
    };
        
    stopBackgroundSound(){
        if(this.backgroundSound !== null){
            this.backgroundSound.stop();
        }
    };

    startButtonClick(){
        // console.dir(this.startButtonSound);
        this.startButtonSound.play();
    };

    letterClick(){
        // console.dir(this.letterSound);
        this.letterSound.play();
    };
}


