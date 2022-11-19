import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, collectionData, collection, setDoc, doc, deleteDoc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  pickCardAnimation=false;
  game: Game; //Variable game speichert das Objekt vom Typ Game
  currentCard: string = '';
  
  //************  FIREBASE  **************/
  observedgames: Observable<any>; //Variable die beobachtet werden kann und sich immer updated, sobald sich ihr wert in der Datenbank geändert hat
  games: Array<any>; //Hier sollen die Daten gespeichert werden immmer wenn sich etwas geändert hat
  gametext= 'idiota22222';
  //************  FIREBASE  **************/

  //************  FIREBASE  **************/
    constructor(private firestore: Firestore, public dialog: MatDialog) { // Library 'Firestore' wird importiert und als Objekt in Variable 'firestore' gespeichert

    }
  //************  FIREBASE  **************/




  ngOnInit(): void {
    this.newGame();
  
        // (coll weil sonst verwechselt firebase Variable und Funktion)
        const coll = collection(this.firestore, 'games'); // Wir greifen auf die collection/Sammlung mit dem Namen 'games' zu und speichern diese in der Variable 'coll'
        this.observedgames = collectionData(coll); //Daten aus unserer collection/Sammlung werden mit collectionData() abgerufen und in unserer Variable observedgame gespeichert werden
        
        //Mit subscribe() abonnieren wir Änderungen inder Datenbank und sobald eine Änderung stattfindet werden uns die alten & neuen Games in Echtzeit angezeigt
        this.observedgames.subscribe( (newGames) => {
          console.log('Neue Games sind', newGames); //Geänderte Daten ausgeben
          //!!!!! Auch möglich: Nachrichten oder Geräusche ausgeben !!!!! 
          this.games = newGames; //Geänderte Daten in Array speichern
        });
  }

  newGame(){
    this.game = new Game(); //Objekt wird erstellt und in der Variable game gespeichert
    this.createDocument(this.game.toJson()); //Immer wenn das Spiel neu gestartet wird dann wird das neue Spiel als Json in der Collection gespeichert

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




//************  FIREBASE  **************/
//Neues Dokument wird zur Sammlung/Collection games hinzugefügt und die Daten sind im JSON-Objekt; Schlüssel wird automatisch generiert
createDocument(fieldValue: any){
  console.log('AddDocument ausgeführt');
  const coll = collection(this.firestore, 'games');
  setDoc(doc(coll), {game: fieldValue});
}

//Daten eines Dokumentes auslesen -> noch anzupassen
async readDocument(id: string) {
  const coll = collection(this.firestore, 'games');
  const docRef = doc(coll,id);
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data());
  return docSnap.data();
}

//Bestehendes Dokument der Sammlung/Collection wird mit den Daten des JSON-Objekts überschrieben; Dafür wird der Schlüssel übergeben
updateDocument(id: string, fieldValue: string){
  const coll = collection(this.firestore, 'games');
  setDoc(doc(coll,id), {game: fieldValue}); 
}

//Bestehendes Dokument der Sammlung/Collection wird gelöscht; Dafür wird der Schlüssel übergeben
  async deleteDocument(id: string){
    const coll = collection(this.firestore, 'games');
    await deleteDoc(doc(coll,id));
  }
//************  FIREBASE  **************/




}
