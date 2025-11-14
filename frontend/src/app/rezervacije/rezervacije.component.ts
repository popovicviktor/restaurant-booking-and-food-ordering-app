import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { RestoranService } from '../services/restoran.service';
import { Restoran } from '../models/restoran';
import { User } from '../models/user';
import { Rezervacija } from '../models/rezervacija';

@Component({
  selector: 'app-rezervacije',
  templateUrl: './rezervacije.component.html',
  styleUrls: ['./rezervacije.component.css']
})
export class RezervacijeComponent implements OnInit{

  restorani: Restoran[] = [];
  user: User = new User();
  rezervacije: Rezervacija[] = [];
  restoraniRezervacije: Restoran[] = [];
  rezervacijeArhiva: Rezervacija[] = [];
  view: string = "";
  rezervacija: Rezervacija = new Rezervacija();
  rezervacijaStara: Rezervacija = new Rezervacija();

  constructor(private Uservis: UserService, private Rservis: RestoranService, private router: Router) { }

  ngOnInit(): void {
    let userString = localStorage.getItem("user");
    if(userString != null) {
      let userLCS = JSON.parse(userString);
      this.user = userLCS;
    }
    this.getAllRestorani();
  }

  logout(){
    if(localStorage.getItem("logged") != null){
      localStorage.removeItem("logged");
      localStorage.removeItem("user");
      localStorage.removeItem("restoran");
      this.router.navigate([""]);
    }
  }

  getAllRestorani() {
    this.Rservis.getAllRestorani().subscribe(data => {
      this.restorani = data;
      for(let i = 0; i < this.restorani.length; i++) {
        for(let j = 0; j < this.restorani[i].rezervacije_aktuelne.length; j++) {
        if(this.restorani[i].rezervacije_aktuelne[j].vlasnik === this.user.korisnicko_ime)this.rezervacije.push(this.restorani[i].rezervacije_aktuelne[j]);
      }
    }
    for(let i = 0; i < this.restorani.length; i++) {
      for(let j = 0; j < this.restorani[i].rezervacije_istekle.length; j++) {
        if(this.restorani[i].rezervacije_istekle[j].vlasnik === this.user.korisnicko_ime)this.rezervacijeArhiva.push(this.restorani[i].rezervacije_istekle[j]);
      }
    }
    });
  }

  getDatum(datum: string) {
    let date = new Date(datum);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}h`;
}

  getAdresa(restoran: string) {
    for(let i = 0; i < this.restorani.length; i++) {
      if(this.restorani[i].naziv === restoran) return this.restorani[i].adresa;
    }
    return "";
  }

  otkazNaVreme(rezervacija: Rezervacija) {
    let date = new Date(rezervacija.pocetak);
    let currentDate = new Date();
    const minimalnoVremeZaOtkaz = 45 * 60 * 1000;
    if(date.getTime() - currentDate.getTime() > minimalnoVremeZaOtkaz) return true;
    return false;
  }

  otkazi(rezervacija: Rezervacija) {
    this.Rservis.otkaziRezervaciju(rezervacija).subscribe(data => {
      if(data.message == 'Ok') this.rezervacije = this.rezervacije.filter(r => r !== rezervacija);
      else alert("Greska pri otkazivanju rezervacije.");
    });
  }

  changeView(view: string) {
    this.view = view;
  }

  getDatumVreme(datum: string) {
    let date = new Date(datum);
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + ".";
  }
  posaljiOcenu() {
    if(this.rezervacija.ocena == 0) {
      alert("Morate izabrati ocenu.");
      return;
    }
    this.Rservis.oceni(this.rezervacija, this.rezervacijaStara).subscribe(data => {
      if(data.message === 'Ok') {
        alert("Uspesno ste ocenili restoran.")
        this.rezervacija = new Rezervacija();
        this.changeView('');
      }
      else alert("Greska pri ocenjivanju.");
    });
  }
  oceni(rezervacija1: Rezervacija) {
    this.rezervacijaStara = { ...rezervacija1 };
this.rezervacija = rezervacija1;
    console.log(this.rezervacijaStara);
    this.changeView('oceni');
  }

  oceniRezervaciju(event: any) {
    const ocena = event.target.value;
    if(ocena == 0) {
      alert("Morate izabrati ocenu.");
      return;
    }
    this.rezervacija.ocena = ocena;
  }
}
