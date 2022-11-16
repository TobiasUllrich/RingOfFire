import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  pickCardAnimation=false;
  game: Game; //Variable game speichert das Objekt vom Typ Game
  currentCard: string = '';
  

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(){
    this.game = new Game(); //Objekt wird erstellt und in der Variable game gespeichert
  }

  takeCard(){
    if(!this.pickCardAnimation){ //Nur wenn keine Karten-Animation abläuft kann man die nächste Karte ziehen
    this.currentCard = this.game.stack.pop();
    this.pickCardAnimation=true;   
    console.log('New Card ' + this.currentCard);
    console.log('Game is ' + this.game);

    this.game.currentPlayer++; //Nächster Spieler ist dran
    this.game.currentPlayer=this.game.currentPlayer % this.game.players.length; //Wenn wir am Ende sind gehts wieder von vorne los

    setTimeout(()=>{
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation=false;
    },1000);
    }
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){ //Spieler wird beim schließen des Dialogs nur hinzugefügt, wenn ein Name existiert (1.Bed) und er eingegeben wurde (2. Bed)
      this.game.players.push(name);
      }
      console.log('The dialog was closed',name);
    });
  }

}
