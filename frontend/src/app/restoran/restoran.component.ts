import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { RestoranService } from '../services/restoran.service';
import { Restoran } from '../models/restoran';
import { Rezervacija } from '../models/rezervacija';
import { User } from '../models/user';
import { Jelo } from '../models/jelo';
import { Narudzbina } from '../models/narudzbina';
import { Narudzbine } from '../models/narudzbine';

@Component({
  selector: 'app-restoran',
  templateUrl: './restoran.component.html',
  styleUrls: ['./restoran.component.css']
})
export class RestoranComponent implements OnInit{

  constructor(private Uservis: UserService, private Rservis: RestoranService, private router: Router) { }

  restoran: Restoran = new Restoran();
  zakazivanjeBool: boolean = false;
  selectedDateTime: string="";
  brojOsoba: number=0;
  zahtev: string="";
  user: User = new User();
  menuBool: boolean = false;
  narudzbine: Narudzbine = new Narudzbine();
  narudzbina: Narudzbina = new Narudzbina();
  kolicina: number[] = [];

  ngOnInit(): void {
    let restoranString = localStorage.getItem("restoran");
    if(restoranString != null) {
      let restoranLCS = JSON.parse(restoranString);
      this.restoran = restoranLCS;
    }
    let userString = localStorage.getItem("user");
    if(userString != null) {
      let userLCS = JSON.parse(userString);
      this.user = userLCS;
    }
  }


  logout(){
    if(localStorage.getItem("logged") != null){
      localStorage.removeItem("logged");
      localStorage.removeItem("user");
      localStorage.removeItem("restoran");
      this.router.navigate([""]);
    }
  }

  return(){
    if(this.menuBool){
      this.menuBool = false;
    }
    else if(this.zakazivanjeBool){
      this.zakazivanjeBool = false;
    }
    else{
    this.router.navigate(["restorani"]);
    }
  }

  zakazivanje(){
    this.zakazivanjeBool = true;
  }

  rezervisiSto() {
    const selectedDate = new Date(this.selectedDateTime);
  if (isNaN(selectedDate.getTime()) || selectedDate.getTime() < new Date().getTime()){
    alert('Izabrani datum nije validan.');
    return;
  }

  const dayOfWeek = selectedDate.getDay();
  let dayOfWeekString = "";
  switch(dayOfWeek) {
    case 0: dayOfWeekString = "nedelja"; break;
    case 1: dayOfWeekString = "ponedeljak"; break;
    case 2: dayOfWeekString = "utorak"; break;
    case 3: dayOfWeekString = "sreda"; break;
    case 4: dayOfWeekString = "cetvrtak"; break;
    case 5: dayOfWeekString = "petak"; break;
    case 6: dayOfWeekString = "subota"; break;
    default:
      alert('Došlo je do greške pri određivanju dana u nedelji.');
      return;
  }
  let radnoVremeForDay;
  for (let radnoVreme of this.restoran.radno_vreme) {
    if (radnoVreme.dan === dayOfWeekString) {
      radnoVremeForDay = radnoVreme;
      break;
    }
  }

    if (!radnoVremeForDay) {
      alert('Restoran ne radi na izabrani dan.');
      return;
    }



    const pocetak = new Date(selectedDate);
    pocetak.setHours(parseInt(radnoVremeForDay.pocetak.split(':')[0]), parseInt(radnoVremeForDay.pocetak.split(':')[1]));
    const kraj = new Date(selectedDate);
    kraj.setHours(parseInt(radnoVremeForDay.kraj.split(':')[0]), parseInt(radnoVremeForDay.kraj.split(':')[1]));
    const selectedEnd = new Date(selectedDate.getTime() + 3 * 60 * 60 * 1000);

    if (selectedDate < pocetak || selectedDate > kraj || selectedEnd > kraj) {
      alert('Izabrano vreme nije unutar radnog vremena restorana.');
      return;
    }
    console.log(this.restoran.stolovi[0].kapacitet);
    const dostupanSto = this.restoran.stolovi.find(sto => sto.kapacitet >= this.brojOsoba);

    if (!dostupanSto) {
      alert('Nema dostupnih stolova za izabrani broj osoba');
      return;
    }




    if(this.brojOsoba <= 0){
      alert('Morate uneti broj osoba.');
      return;
    }

    const novaRezervacija = new Rezervacija();

    novaRezervacija.vlasnik = this.user.korisnicko_ime;
    novaRezervacija.restoran = this.restoran.naziv;
    novaRezervacija.pocetak = this.selectedDateTime;
    novaRezervacija.kraj = new Date(selectedDate.getTime() + 3 * 60 * 60 * 1000).toISOString(); // Pretpostavka da rezervacija traje 3 sata
    novaRezervacija.status = "Zahtev";
    novaRezervacija.gosti = this.brojOsoba;
    novaRezervacija.napomena = this.zahtev;

    for(let i = 0; i < this.restoran.stolovi.length; i++){
      if(this.restoran.stolovi[i].kapacitet >= this.brojOsoba && !this.zauzet(this.restoran.stolovi[i].id, novaRezervacija)){
        break;
      }
      alert('Nema dostupnih stolova za izabrani broj osoba u izabranom terminu.');
      return;
    }

    this.Rservis.rezervisiSto(this.restoran.naziv, novaRezervacija).subscribe(
      (data) => {
        alert('Vaša rezervacija je uspešno zabeležena i čeka na odobrenje.');
        this.restoran.rezervacije_aktuelne.push(novaRezervacija);
      }
    );
  }

  showMenu(){
    this.menuBool = true;
  }

  fixImagePath(path: string): string {
    return path.replace(/\\/g, '/');
  }

  dodajUKorpu(jelo: Jelo, kolicina: number){
    if(kolicina == 0 || kolicina == null) {
      alert('Količina mora biti veća od 0.');
      return;
    }
    if(jelo == null){
      alert('Morate izabrati jelo.');
      return;
    }
    this.narudzbina = new Narudzbina();
    this.narudzbina.jelo = jelo;
    this.narudzbina.kolicina = kolicina;
    this.narudzbina.cena = jelo.cena * kolicina;
    this.narudzbine.narudzbine.push(this.narudzbina);
    this.narudzbine.ukupna_cena += this.narudzbina.cena;
    this.narudzbina = new Narudzbina();
  }
  ukloni(narudzbina: Narudzbina){
    this.narudzbine.narudzbine = this.narudzbine.narudzbine.filter(n => n != narudzbina);
  }

  naruci(){
    if(this.narudzbine.narudzbine.length == 0){
      alert('Morate izabrati bar jedno jelo.');
      return;
    }
    this.narudzbine.restoran = this.restoran.naziv;
    this.narudzbine.status = "zahtev";
    this.narudzbine.vlasnik = this.user.korisnicko_ime;
    this.narudzbine.datum = new Date().toISOString();
    this.Rservis.naruci(this.narudzbine).subscribe(
      data=>{
        if (data.message == 'ok')alert('Narudžbina je uspešno poslata.');
        else alert('Došlo je do greške prilikom slanja narudžbine.');
        this.narudzbine = new Narudzbine();
        this.kolicina = [];
      }
    )
  }

  zauzet(sto_id: number, rezervacija: Rezervacija){
        for(let j = 0; j < this.restoran.rezervacije_aktuelne.length; j++) {
          if(this.restoran.rezervacije_aktuelne[j].sto_id == sto_id && this.restoran.rezervacije_aktuelne[j].status == "Odobreno" && (new Date(rezervacija.pocetak).getTime() <= new Date(this.restoran.rezervacije_aktuelne[j].kraj).getTime() && new Date(rezervacija.kraj).getTime() >= new Date(this.restoran.rezervacije_aktuelne[j].pocetak).getTime())) {
            return true;
          }
        }
    return false;
  }
}
