import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Narudzbine } from '../models/narudzbine';

@Component({
  selector: 'app-dostave',
  templateUrl: './dostave.component.html',
  styleUrls: ['./dostave.component.css']
})
export class DostaveComponent implements OnInit{

  constructor(private Uservis: UserService, private Rservis: RestoranService, private router: Router) { }

  user: User = new User();
  dostave: Narudzbine[] = [];
  view: string = "";
  dostava: Narudzbine = new Narudzbine();
  prihvaceno: boolean = false;
  radio: string = "";

  ngOnInit(): void {
    let userString = localStorage.getItem("user");
    if(userString != null) {
      let userLCS = JSON.parse(userString);
      this.user = userLCS;
    }
    this.getNarudzbine();
  }


  getNarudzbine() {
    this.Rservis.getAllRestorani().subscribe(restorani => {
      this.Rservis.getNarudzbine().subscribe(data => {
        for(let i = 0; i < restorani.length; i++) {
          if(restorani[i].konobari.includes(this.user.korisnicko_ime)) {
            for(let j = 0; j < data.length; j++) {
              if(data[j].restoran === restorani[i].naziv) {
                this.dostave.push(data[j]);
              }
            }
          }
        }
      });
    });
  }

  changeView(view: string) {
    this.view = view;
  }

  logout(){
    if(localStorage.getItem("logged") != null){
      localStorage.removeItem("logged");
      localStorage.removeItem("user");
      localStorage.removeItem("restoran");
      this.router.navigate([""]);
    }
  }

  pregled(dostava: Narudzbine){
    this.dostava = new Narudzbine();
    this.dostava = dostava;
    this.changeView("pregled");
  }
  prihvati(dostava: Narudzbine){
    this.prihvaceno = true;
    this.radio = "";
  }
  nazad(){
    this.prihvaceno = false;
    this.radio = "";
  }

  prihvati1(dostava: Narudzbine){
    if(this.radio === ""){
      alert("Morate izabrati okvirno vreme dostave");
      return;
    }
    this.Rservis.prihvatiNarudzbinu(dostava, this.radio).subscribe(data => {
      if(data.message === "Ok"){
        alert("Narudzbina uspesno prihvacena");
        this.dostave = [];
        this.getNarudzbine();
        this.changeView("aktuelne")
      }
    });
    this.prihvaceno = false;
  }
  odbij(dostava: Narudzbine){
    this.Rservis.odbijNarudzbinu(dostava).subscribe(data => {
      if(data.message === "Ok"){
        alert("Narudzbina uspesno odbijena");
        this.dostave = [];
        this.getNarudzbine();
        this.changeView("aktuelne")
      }
    });
  }

  getDatumVreme(datum: string) {
    let date = new Date(datum);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}.${date.getFullYear()}.`;
  }

  getVreme(datum: string) {
    let date = new Date(datum);
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes;
  }

  zavrsiDostavu(dostava: Narudzbine){
    this.Rservis.zavrsiDostavu(dostava).subscribe(data => {
      if(data.message === "Ok"){
        alert("Dostava uspesno zavrsena");
        this.dostave = [];
        this.getNarudzbine();
        this.changeView("aktuelne")
      }
    });
  }
}
