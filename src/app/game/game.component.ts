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
  
  // Library 'Firestore' wird importiert und als Objekt in Variable 'firestore' gespeichert
  constructor(public dialog: MatDialog, private firestore: Firestore) { 
      // (coll weil sonst verwechselt firebase Variable und Funktion)
      const coll = collection(firestore, 'todos'); // Wir greifen auf die collection/Sammlung mit dem Namen 'todos zu' und speichern diese in der Variable 'coll'
      this.todos = collectionData(coll); //Daten aus unserer collection/Sammlung werden mit collectionData() abgerufen und in unserer Variable todos gespeichert werden
      
      //Mit subscribe() abonnieren wir Änderungen inder Datenbank und sobald eine Änderung stattfindet werden uns die neuen Todos in Echtzeit angezeigt
      this.todos.subscribe( (newTodos) => {
        console.log('Neue Todos sind', newTodos); //Geänderte Daten ausgeben
        //Auch möglich: Nachrichten oder Geräusche ausgeben
        this.todosakt = newTodos; //Geänderte Daten in Array speichern
      })
    }   
  

  ngOnInit(): void {
    this.newGame();}




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


  //DB-ZEUGS
  todos: Observable<any>; //Variable die beobachtet werden kann und sich immer updated, sobald sich ihr wert in der datenbank geändert hat
  todosakt:Array<any>; //Hier sollen die Daten gespeichert werden immmer wenn sich etwas geändert hat
  todotext= 'hallo';

  //Neues Dokument wird zur Sammlung/Collection todos hinzugefügt und die Daten sind im JSON-Objekt; Schlüssel wird automatisch generiert
  addToDo(){
    const coll = collection(this.firestore, 'todos');
    setDoc(doc(coll), {name: this.todotext});
    console.log(this.readToDo( 'W3TzEVlQFH8p2e178IcP'));
  }
  
  //Daten abrufen -> noch anzupassen
  async readToDo(id: string) {
    const coll = collection(this.firestore, 'todos');
    const docRef = doc(coll,id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  }

  //Bestehendes Dokument der Sammlung/Collection todos wird mit den Daten des JSON-Objekts überschrieben; Dafür wird der Schlüssel übergeben
  updateToDo(id: string){
    const coll = collection(this.firestore, 'todos');
    setDoc(doc(coll,id), {name: this.todotext}); 
  }

  //Bestehendes Dokument der Sammlung/Collection todos wird gelöscht; Dafür wird der Schlüssel übergeben
    async deleteToDo(id: string){
      const coll = collection(this.firestore, 'todos');
      await deleteDoc(doc(coll,id));
    }


}
