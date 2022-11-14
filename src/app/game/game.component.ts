import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  pickCardAnimation=false;
  game: Game | any; //Variable game speichert das Objekt vom Typ Game
  currentCard: string = '';

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(){
    this.game = new Game(); //Objekt wird erstellt und in der Variable game gespeichert
    console.log(this.game);
  }

  takeCard(){
    if(!this.pickCardAnimation){ //Nur wenn keine Karten-Animation abläuft kann man die nächste Karte ziehen
    this.currentCard = this.game.stack.pop();
    console.log(this.currentCard);
    this.pickCardAnimation=true;
    
    setTimeout(()=>{this.pickCardAnimation=false;},1500);
    }
  }
  
}
