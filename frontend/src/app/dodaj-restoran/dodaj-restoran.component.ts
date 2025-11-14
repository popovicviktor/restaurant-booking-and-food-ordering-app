import { Component, OnInit } from '@angular/core';
import { RestoranService } from '../services/restoran.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Restoran } from '../models/restoran';
import { Jelo } from '../models/jelo';

@Component({
  selector: 'app-dodaj-restoran',
  templateUrl: './dodaj-restoran.component.html',
  styleUrls: ['./dodaj-restoran.component.css']
})
export class DodajRestoranComponent  implements OnInit{

  constructor(private servis: UserService, private restoranServis: RestoranService,
    private router: Router){}

    users: User[] = [];
    restorani: Restoran[] = [];
    restoran: Restoran = new Restoran();
    jelo1: Jelo = new Jelo();
    jelo2: Jelo = new Jelo();
    jelo3: Jelo = new Jelo();
    ngOnInit(): void {
    this.getAllUsers();
    this.getAllRestorani();
    this.jelo1.cena =1700;
    this.jelo1.naziv = "cevapi";
    this.jelo1.slika = "uploads\\cevapi.jpg";
    this.jelo1.sastojci.push("mlevena junetina");
    this.jelo1.sastojci.push("luk");
    this.jelo1.sastojci.push("mlevena svinjetina");
    this.jelo2.naziv = "kajgana";
    this.jelo2.cena = 1200;
    this.jelo2.slika = "uploads\\kajgana.jpg";
    this.jelo2.sastojci.push("jaja");
    this.jelo2.sastojci.push("so");
    this.jelo2.sastojci.push("sir");
    this.jelo2.sastojci.push("slanina");
    this.jelo3.naziv = "komplet lepinja";
    this.jelo3.cena = 990;
    this.jelo3.slika = "uploads\\kompletLepinja.jpg"
    this.jelo3.sastojci.push("lepinja");
    this.jelo3.sastojci.push("kajmak");
    this.jelo3.sastojci.push("sir");
    this.jelo3.sastojci.push("slanina");
    this.restoran.jelovnik.push(this.jelo1);
    this.restoran.jelovnik.push(this.jelo2);
    this.restoran.jelovnik.push(this.jelo3);
  }

  getAllUsers(){
    this.servis.getAllUsers().subscribe(
      data=>{
        this.users = data;
      }
    )
  }

  getAllRestorani(){
    this.restoranServis.getAllRestorani().subscribe(
      data=>{
        this.restorani = data;
      }
    )
  }

  logout(){
    if(localStorage.getItem("logged") != null){
      localStorage.removeItem("logged");
      localStorage.removeItem("user");
      localStorage.removeItem("restoran");
      this.router.navigate([""]);
    }
  }

  dodajRestoran(){
    if(this.restoran.kuhinje.length == 0){
      alert("Morate uneti validan raspored kuhinja restorana");
      return;
    }
    if(this.restoran.stolovi.length == 0){
      alert("Morate uneti validan raspored stolova restorana");
      return;
    }
    if(this.restoran.toaleti.length == 0){
      alert("Morate uneti validan raspored toaleta restorana");
      return;
    }
    if(this.restoran.tip == ""){
      alert("Morate uneti tip restorana");
      return;
    }
    if(this.restoran.naziv == ""){
      alert("Morate uneti naziv restorana");
      return;
    }
    if(this.restoran.adresa == ""){
      alert("Morate uneti adresu restorana");
      return;
    }
    if(this.restoran.telefon == ""){
      alert("Morate uneti telefon restorana");
      return;
    }
    if(this.restoran.opis == ""){
      alert("Morate uneti opis restorana");
      return;
    }
    for(let i = 0; i < this.restorani.length; i++){
      if(this.restorani[i].naziv == this.restoran.naziv){
        alert("Restoran sa tim nazivom već postoji");
        return;
      }
      if(this.restorani[i].adresa == this.restoran.adresa){
        alert("Restoran sa tom adresom već postoji");
        return;
      }
    }
    const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if(!pattern.test(this.restoran.telefon)){
      alert("Morate uneti validan broj telefona u podržanom formatu: \n (123) 456-7890 \n123-456-7890 \n1234567890")
      return;
    }
    this.restoranServis.dodajRestoran(this.restoran).subscribe(
      data=>{
        alert("Uspešno ste dodali restoran");
        this.ngOnInit();
      }
    )
  }

  ucitajJSON(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        try {
          const json = JSON.parse(fileReader.result as string);
          this.restoran.stolovi = json[0].stolovi;
          this.restoran.kuhinje = json[0].kuhinje;
          this.restoran.toaleti = json[0].toaleti;
        } catch (err) {
          console.error('Greška pri parsiranju JSON-a:', err);
        }
      };
      fileReader.readAsText(file);
    }
  }
}
