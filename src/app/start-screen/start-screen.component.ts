import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(private router: Router, private firestore: Firestore) { }

  ngOnInit(): void {
  }

  //Immer wenn das Spiel neu gestartet wird dann wird das neue Spiel als Json in der Collection gespeichert  
  newGame() {
    let game = new Game(); //Objekt wird erstellt und in der Variable game gespeichert
    this.createDocument(game.toJson()).then((gameInfo) => {
      this.router.navigateByUrl('/game/' + gameInfo.id); //Navigation zur Url mit game id
    }
    ); 
  }

  //Neues Dokument wird zur Sammlung/Collection games hinzugefügt und die Daten sind im JSON-Objekt; Schlüssel wird automatisch generiert
  async createDocument(fieldValue: any) {
    const coll = collection(this.firestore, 'games');
    return await addDoc(coll, { game: fieldValue });
  }


}
