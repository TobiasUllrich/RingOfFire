import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  pickCardAnimation=false;
  game: Game | undefined;

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(){
    this.game = new Game(); //Leeres JSON-Objekt wird erstellt und in der Variable gespeichert
    console.log(this.game);
  }

  takeCard(){
    this.pickCardAnimation=true;
  }

}
