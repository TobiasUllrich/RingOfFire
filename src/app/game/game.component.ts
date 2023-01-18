import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import { Firestore, collectionData, collection, setDoc, doc, deleteDoc, addDoc, getDoc, onSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  game: Game; //Variable game speichert das Objekt vom Typ Game
  gameId: string;
  gameOver: boolean = false;

  observedgame: Observable<any>; //Variable die beobachtet werden kann und sich immer updated, sobald sich ihr wert in der Datenbank geändert hat
  games: Array<any>; //Hier sollen die Daten gespeichert werden immmer wenn sich etwas geändert hat
  gametext= '';

  // Service 'ActivatedRoute' wird importiert und in Variable 'route' gespeichert
  // Library 'Firestore' wird importiert und als Objekt in Variable 'firestore' gespeichert
    constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {}


  ngOnInit(): void {
 
    //Neues Spiel soll beobachtet werden, wofür zuersteinmal die id ermitteln
    this.route.params.subscribe((params)=>{
      
         //console.log('Aktuelle ID ' + params['id']); //Parameter der route ausgeben
         this.gameId = params['id']; //Globale Speicherung der ID um sie überall verwenden zu können

          // (coll weil sonst verwechselt firebase Variable und Funktion)
          const coll = collection(this.firestore, 'games'); // Wir greifen auf die collection/Sammlung mit dem Namen 'games' zu und speichern diese in der Variable 'coll'
          this.observedgame = collectionData(coll, { idField: 'id'});
          
          //Mit subscribe() abonnieren wir Änderungen in der Datenbank und sobald eine Änderung stattfindet werden uns die alten & neuen Games in Echtzeit angezeigt
          this.observedgame.subscribe( (x) => {
            let result = x.filter(games => games['id'] == this.gameId); //Aus allen Spielen das gewünschte herausfiltern
            result = result['0']['game']; //Speichert das aktuelle Spiel als JSON in der Variable
            this.game = result;  //Erst jetzt haben wir das gesuchte Spiel zum aktuellen Spiel gemacht indem wir es im Game-Objekt gespeichert haben
            //!!!!! Auch möglich: Nachrichten oder Geräusche ausgeben !!!!! 
          });    
    }); 
  }


  takeCard(){
    //Es müssen mindestens zwei Spieler existieren
    if(typeof this.game.players[0]!=='undefined' && this.game.players.length>1){
    if(this.game.stack.length==0){
       this.gameOver=true;
    }
    else{
    if(!this.game.pickCardAnimation){ //Nur wenn keine Karten-Animation abläuft kann man die nächste Karte ziehen
    this.game.currentCard = this.game.stack.pop();
    this.game.pickCardAnimation=true;   

    this.game.currentPlayer++; //Nächster Spieler ist dran
    this.game.currentPlayer=this.game.currentPlayer % this.game.players.length; //Wenn wir am Ende sind gehts wieder von vorne los
    this.saveGame(); //Nachdem die oben liegende Karte gezogen wurde wird das Spiel gespeichert

    setTimeout(()=>{
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation=false;
      this.saveGame(); //Nachdem die oben liegende Karte gezogen wurde, wird das Spiel gespeichert
    },1000);
    }
    }
    }
  }

  
  editPlayer(playerId: number){
   console.log('Edit player',playerId);
   const dialogRef = this.dialog.open(EditPlayerComponent);
   dialogRef.afterClosed().subscribe((change: string) => {
    if(change){
      if(change == 'DELETE'){
        this.game.player_images.splice(playerId,1);
        this.game.players.splice(playerId,1);
      }
      else{
        this.game.player_images[playerId]=change;
      }
      console.log('Received change',change);
      this.saveGame(); //Nachdem ein Bild geändert wurde wird das Spiel gespeichert
    }
  });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){ //Spieler wird beim schließen des Dialogs nur hinzugefügt, wenn ein Name existiert (1.Bed) und er eingegeben wurde (2. Bed)
      this.game.players.push(name);
      this.game.player_images.push('male.png');
      this.saveGame(); //Nachdem ein Spieler hinzugefügt wurde wird das Spiel gespeichert
      }
      //console.log('The dialog was closed',name);
    });
  }




//************  FIREBASE  **************/
//Neues Dokument wird zur Sammlung/Collection games hinzugefügt und die Daten sind im JSON-Objekt; Schlüssel wird automatisch generiert
async createDocument(fieldValue: any) : Promise <any> {
  const coll = collection(this.firestore, 'games');
  return await addDoc(coll, {game: fieldValue});
}


//Daten eines Dokumentes auslesen
async readDocument(id: string) {
  const coll = collection(this.firestore, 'games');
  const docRef = doc(coll,id);
  const docSnap = await getDoc(docRef);
  return (await (getDoc(docRef))).data();
}

//Bestehendes Dokument der Sammlung/Collection wird mit den Daten des JSON-Objekts überschrieben; Dafür wird der Schlüssel übergeben
updateDocument(id: string, fieldValue: object){
  const coll = collection(this.firestore, 'games');
  setDoc(doc(coll,id), {game: fieldValue}); 
}

//Bestehendes Dokument der Sammlung/Collection wird gelöscht; Dafür wird der Schlüssel übergeben
  async deleteDocument(id: string){
    const coll = collection(this.firestore, 'games');
    await deleteDoc(doc(coll,id));
  }
//************  FIREBASE  **************/



// Saves the game
saveGame(){
  this.updateDocument(this.gameId, this.game); //this.game.toJson() nicht benötigt
}

}
