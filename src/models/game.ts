export class Game {
   public players: string[] = [];
   public player_images: string[] = [];
   public stack: string[] = [];
   public playedCards: string[] = [];
   public currentPlayer: number = 0;
   public pickCardAnimation = false;
   public currentCard: string = '';


   constructor(){
    for(let i = 1;i < 14; i++){
        this.stack.push('spades_' + i);
        this.stack.push('hearts_' + i);
        this.stack.push('clubs_' + i);
        this.stack.push('diamonds_' + i);
    }
    shuffle(this.stack); 
   }

//Nicht benötigt
public toJson(){
  return{
    stack: this.stack,
    playedCards: this.playedCards,
    players: this.players,
    player_images: this.player_images,
    currentPlayer: this.currentPlayer,
    pickCardAnimation: this.pickCardAnimation,
    currentCard: this.currentCard
  };
}
}

//Shuffles the stack
function shuffle(array: any) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
