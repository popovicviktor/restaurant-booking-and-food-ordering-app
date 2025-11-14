import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restoran } from '../models/restoran';
import { Rezervacija } from '../models/rezervacija';
import { Message } from '../models/message';
import { Narudzbine } from '../models/narudzbine';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RestoranService {

  constructor(private http: HttpClient) { }

  getAllRestorani(){
    return this.http.get<Restoran[]>("http://localhost:4000/restorani/getAllRestorani");
  }

  rezervisiSto(restoranNaziv: string, rezervacija: any){
    return this.http.post("http://localhost:4000/restorani/rezervisiSto", {restoranNaziv, rezervacija});
  }

  naruci(narudzbina: any){
    return this.http.post<Message>("http://localhost:4000/restorani/naruci", {narudzbina});
  }

  otkaziRezervaciju(rezervacija: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restorani/otkaziRezervaciju", {rezervacija});
  }
  oceni(rezervacija: Rezervacija, rezervacijaStara: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restorani/oceni", {rezervacija, rezervacijaStara});
  }

  getNarudzbine(){
    return this.http.get<Narudzbine[]>("http://localhost:4000/restorani/getNarudzbine");
  }
  prihvatiRezervaciju(rezervacija: Rezervacija, stol: number, user: string){
    return this.http.post<Message>("http://localhost:4000/restorani/prihvati", {rezervacija, stol, user});
  }

  odbijRezervaciju(rezervacija: Rezervacija, komentar: string){
    return this.http.post<Message>("http://localhost:4000/restorani/odbij", {rezervacija, komentar});
  }
  pojavioSe(rezervacija: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restorani/pojavioSe", {rezervacija});
  }
  arhivirajRezervaciju(rezervacija: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restorani/arhiviraj", {rezervacija});
  }

  prihvatiNarudzbinu(narudzbina: Narudzbine, vreme: string){
    return this.http.post<Message>("http://localhost:4000/restorani/prihvatiNarudzbinu", {narudzbina, vreme});
  }

  odbijNarudzbinu(narudzbina: Narudzbine){
    return this.http.post<Message>("http://localhost:4000/restorani/odbijNarudzbinu", {narudzbina});
  }

  zavrsiDostavu(narudzbina: Narudzbine){
    return this.http.post<Message>("http://localhost:4000/restorani/zavrsiDostavu", {narudzbina});
  }
  dosao(rezervacija: Rezervacija){
    return this.http.post<Message>("http://localhost:4000/restorani/dosao", {rezervacija});
  }
  dodajKonobara(user: string, restoran: string){
    return this.http.post<Message>("http://localhost:4000/restorani/dodajKonobara", {user, restoran});
  }

  dodajRestoran(restoran: Restoran){
    return this.http.post<Message>("http://localhost:4000/restorani/dodajRestoran", {restoran});
  }
  promeniRadnoVreme(restoran: Restoran){
    return this.http.post<Message>("http://localhost:4000/restorani/promeniRadnoVreme", {restoran});
  }
}
