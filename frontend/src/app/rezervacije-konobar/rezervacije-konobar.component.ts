import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Restoran } from '../models/restoran';
import { Rezervacija } from '../models/rezervacija';
import { Sto } from '../models/sto';

@Component({
  selector: 'app-rezervacije-konobar',
  templateUrl: './rezervacije-konobar.component.html',
  styleUrls: ['./rezervacije-konobar.component.css']
})
export class RezervacijeKonobarComponent implements OnInit{

  constructor(private Uservis: UserService, private Rservis: RestoranService, private router: Router) { }

  user: User = new User();
  restorani: Restoran[] = [];
  rezervacijeNeobradjene: any[] = [];
  rezervacijeMoje: any[] = [];
  view: string = "";
  stolovi: Sto[] = [];
  stol: number = 0;
  rezervacija: Rezervacija = new Rezervacija();
  restoran: Restoran = new Restoran();
  komentar: string = "";
  dosaoKorisnik: boolean = false;

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
        if(this.restorani[i].konobari.includes(this.user.korisnicko_ime)){
        for(let j = 0; j < this.restorani[i].rezervacije_aktuelne.length; j++) {
        if(this.restorani[i].rezervacije_aktuelne[j].status === "Zahtev")this.rezervacijeNeobradjene.push(this.restorani[i].rezervacije_aktuelne[j]);
      }
    }
  }
  this.sortirajPoDatumuNeobradjene();
    for(let i = 0; i < this.restorani.length; i++) {
      if(this.restorani[i].konobari.includes(this.user.korisnicko_ime)){
      for(let j = 0; j < this.restorani[i].rezervacije_aktuelne.length; j++) {
        if(this.restorani[i].rezervacije_aktuelne[j].konobar === this.user.korisnicko_ime)this.rezervacijeMoje.push(this.restorani[i].rezervacije_aktuelne[j]);
      }
    }
  }
  this.sortirajPoDatumuMoje();
    });
  }

  getDatum(datum: string) {
    let date = new Date(datum);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}h`;
}

  getAdresa(restoran: string) {
    for(let i = 0; i < this.restorani.length; i++) {
      if(this.restorani[i].naziv === restoran) return this.restorani[i].adresa;
    }
    return "";
  }

  changeView(view: string) {
    this.view = view;
  }

  sortirajPoDatumuNeobradjene() {
    this.rezervacijeNeobradjene.sort((a, b) => {
      return new Date(b.pocetak).getTime() - new Date(a.pocetak).getTime();
    });
  }

  sortirajPoDatumuMoje() {
    this.rezervacijeMoje.sort((a, b) => {
      return new Date(b.pocetak).getTime() - new Date(a.pocetak).getTime();
    });
  }
  prihvati(rezervacija: Rezervacija) {
    if(this.stol === 0) {
      alert("Morate izabrati sto!");
      return;
    }
    this.Rservis.prihvatiRezervaciju(rezervacija, this.stol, this.user.korisnicko_ime).subscribe(data => {
      if(data.message === "ok") {
        alert("Uspesno ste prihvatili rezervaciju!");
      }
      this.rezervacijeNeobradjene = [];
      this.rezervacijeMoje = [];
      this.stol = 0;
      this.getAllRestorani();
      this.changeView("aktuelne");
    });
  }

  pregled(rezervacija: Rezervacija) {
    this.rezervacija = new Rezervacija();
    this.rezervacija = rezervacija;
    this.stolovi = [];
    this.restoran = new Restoran();
    this.stol = 0;
    for(let i = 0; i < this.restorani.length; i++) {
      if(this.restorani[i].naziv === rezervacija.restoran) {
        this.stolovi = this.restorani[i].stolovi;
        this.restoran = this.restorani[i];
      }
    }
    this.changeView("pregled");
    setTimeout(() => this.drawCanvas(), 0);
  }

  // Dodajemo definiciju dva nova pravougaonika

drawCanvas(): void {
  const canvas = document.getElementById('stoloviCanvas') as HTMLCanvasElement;
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Iscrtavanje krugova za svaki sto i dodavanje ID-a stola
      let boja = 'white';
      this.stolovi.forEach(sto => {
        ctx.beginPath();
        ctx.arc(sto.x, sto.y, sto.radius, 0, Math.PI * 2);
        boja = 'white';
        if(this.restorani.length === 0) ctx.fillStyle = 'white'; // Boja stola
        for(let i = 0; i < this.restorani.length; i++) {
          if(this.restorani[i].naziv === this.rezervacija.restoran) {
            for(let j = 0; j < this.restorani[i].rezervacije_aktuelne.length; j++) {
              if(this.restorani[i].rezervacije_aktuelne[j].sto_id == sto.id && (this.restorani[i].rezervacije_aktuelne[j].status == "Odobreno" || this.restorani[i].rezervacije_aktuelne[j].status == "Izvrseno") && (new Date(this.rezervacija.pocetak).getTime() <= new Date(this.restorani[i].rezervacije_aktuelne[j].kraj).getTime() && new Date(this.rezervacija.kraj).getTime() >= new Date(this.restorani[i].rezervacije_aktuelne[j].pocetak).getTime())) {
                ctx.fillStyle = 'red';
                boja = 'red';
              }
            }
          }
        }
        if(boja === 'white') ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
        // Dodavanje ID-a stola
        ctx.fillStyle = 'black'; // Boja teksta
        ctx.font = '16px Arial'; // Veličina i font teksta
        let text = sto.id.toString(); // Pretpostavka da svaki sto ima svoj jedinstveni ID
        let textWidth = ctx.measureText(text).width;
        let textX = sto.x - (textWidth / 2);
        let textY = sto.y + 8; // Adjusting for baseline
        ctx.fillText(text, textX, textY);
      });
      // Iscrtavanje pravougaonika i dodavanje teksta ostaje isto
      this.restoran.kuhinje.forEach((pravougaonik, index) => {
        ctx.beginPath();
        ctx.rect(pravougaonik.x, pravougaonik.y, pravougaonik.width, pravougaonik.height);
        ctx.fillStyle = 'white'; // Možete promeniti boju po želji
        ctx.fill();
        ctx.stroke();
        // Centriranje teksta unutar pravougaonika
        ctx.fillStyle = 'black'; // Boja teksta
        ctx.font = '16px Arial'; // Veličina i font teksta
        let text = 'kuhinja';
        let textWidth = ctx.measureText(text).width;
        let textX = pravougaonik.x + (pravougaonik.width / 2) - (textWidth / 2);
        let textY = pravougaonik.y + (pravougaonik.height / 2) + 8; // Adjusting for baseline
        ctx.fillText(text, textX, textY);
      });
      this.restoran.toaleti.forEach((pravougaonik, index) => {
        ctx.beginPath();
        ctx.rect(pravougaonik.x, pravougaonik.y, pravougaonik.width, pravougaonik.height);
        ctx.fillStyle = 'white'; // Možete promeniti boju po želji
        ctx.fill();
        ctx.stroke();
        // Centriranje teksta unutar pravougaonika
        ctx.fillStyle = 'black'; // Boja teksta
        ctx.font = '16px Arial'; // Veličina i font teksta
        let text = 'toalet ';
        let textWidth = ctx.measureText(text).width;
        let textX = pravougaonik.x + (pravougaonik.width / 2) - (textWidth / 2);
        let textY = pravougaonik.y + (pravougaonik.height / 2) + 8; // Adjusting for baseline
        ctx.fillText(text, textX, textY);
      });
    }
  }
}

  zauzet(sto_id: number){
    for(let i = 0; i < this.restorani.length; i++) {
      if(this.restorani[i].naziv === this.rezervacija.restoran) {
        for(let j = 0; j < this.restorani[i].rezervacije_aktuelne.length; j++) {
          if(this.restorani[i].rezervacije_aktuelne[j].sto_id == sto_id && (this.restorani[i].rezervacije_aktuelne[j].status == "Odobreno" || this.restorani[i].rezervacije_aktuelne[j].status == "Izvrseno") && (new Date(this.rezervacija.pocetak).getTime() <= new Date(this.restorani[i].rezervacije_aktuelne[j].kraj).getTime() && new Date(this.rezervacija.kraj).getTime() >= new Date(this.restorani[i].rezervacije_aktuelne[j].pocetak).getTime())) {
            return false;
          }
        }
      }
    }
    return true;
  }

  odbij(rezervacija: Rezervacija) {
    this.rezervacija = new Rezervacija();
    this.rezervacija = rezervacija;
    this.changeView("odbij");
  }

  odbijanje() {
    this.Rservis.odbijRezervaciju(this.rezervacija, this.komentar).subscribe(data => {
      if(data.message === "Ok") {
        alert("Uspesno ste odbili rezervaciju!");
      }
      this.rezervacijeNeobradjene = [];
      this.rezervacijeMoje = [];
      this.getAllRestorani();
      this.komentar = "";
      this.changeView("aktuelne");
    });
  }

  polaSataPredPocetak(rezervacija: Rezervacija) {
    let pocetak = new Date(rezervacija.pocetak).getTime();
    let trenutno = new Date().getTime();
    return pocetak - trenutno < 1800000;
  }

  pojavioSe(rezervacija: Rezervacija) {
    this.Rservis.pojavioSe(rezervacija).subscribe(data => {
      if(data.message === "Ok") {
        alert("Uspešno ste potvrdili dolazak korisnika u restoran!");
      }
      this.rezervacijeMoje = [];
      this.rezervacijeNeobradjene = [];
      this.getAllRestorani();
      this.changeView("arhiva");
    } );
  }

  nijeSePojavio(rezervacija: Rezervacija) {
    this.Rservis.odbijRezervaciju(rezervacija, "Korisnik se nije pojavio u restoranu.").subscribe(data => {
      if(data.message === "Ok") {
        alert("Uspešno ste odbili rezervaciju!");
      }
      this.rezervacijeMoje = [];
      this.rezervacijeNeobradjene = [];
      this.getAllRestorani();
      this.changeView("arhiva");
    });
  }

  otisao(rezervacija: Rezervacija) {
    this.Rservis.arhivirajRezervaciju(rezervacija).subscribe(data => {
      if(data.message === "Ok") {
        alert("Korisnik je otisao i uspesno ste arhivirali rezervaciju!");
      }
      this.rezervacijeMoje = [];
      this.rezervacijeNeobradjene = [];
      this.getAllRestorani();
      this.changeView("arhiva");
    });
  }
}
