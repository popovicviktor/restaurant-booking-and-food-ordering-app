import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { RestoranService } from '../services/restoran.service';
import { Restoran } from '../models/restoran';
import { User } from '../models/user';
import { Rezervacija } from '../models/rezervacija';

@Component({
  selector: 'app-pocetna-strana',
  templateUrl: './pocetna-strana.component.html',
  styleUrls: ['./pocetna-strana.component.css']
})
export class PocetnaStranaComponent implements OnInit{

  constructor(private Uservis: UserService, private Rservis: RestoranService, private router: Router) { }

  restorani: Restoran[] = [];
  gosti: User[] = [];
  rezervacije: Rezervacija[] = [];
  rezervacije7dana: Rezervacija[] = [];
  rezervacije30dana: Rezervacija[] = [];
  rezervacije24h: Rezervacija[] = [];
  search: boolean = false;
  searchName: string = "";
  searchType: string = "";
  searchAddress: string = "";
  searcResult: Restoran[] = [];
  searchDone = false;
  users: User[] = [];
  brojGostiju: number = 0;

  ngOnInit(): void {
    this.getAllRestorani();
    this.getAllUsers();
  }

    getAllRestorani() {
      this.Rservis.getAllRestorani().subscribe(data => {
        this.restorani = data;
        for(let i=0; i<this.restorani.length; i++){
          this.restorani[i].rezervacije_istekle.forEach(rezervacija => {
            if ((rezervacija.status === "Odobreno" || rezervacija.status == "Izvrseno")) {
              this.rezervacije.push(rezervacija);
              this.brojGostiju += rezervacija.gosti;
            }
            })
            this.restorani[i].rezervacije_aktuelne.forEach(rezervacija => {
              if ((rezervacija.status === "Odobreno" || rezervacija.status == "Izvrseno")) {
                this.rezervacije.push(rezervacija);
                this.brojGostiju += rezervacija.gosti;
              }
              })
        }
        this.getRezervacije7dana();
        this.getRezervacije30dana();
        this.getRezervacije24h();
      });
    }

    getAllUsers(){
      this.Uservis.getAllUsers().subscribe(
        data=>{
          this.users = data;
          for(let i=0; i<data.length; i++){
            if(data[i].tip == "gost"){
              this.gosti.push(data[i]);
            }
          }
        }
      )
    }

    getRezervacije7dana(){
      this.rezervacije7dana = [];
      let danas = new Date();
      for(let i = 0; i < this.rezervacije.length; i++){
        let datum = new Date(this.rezervacije[i].pocetak);
        let razlika = danas.getTime() - datum.getTime();
        let razlikaDani = Math.floor(razlika / (1000 * 3600 * 24));
        if(razlikaDani >= 0 && razlikaDani <= 7){
          this.rezervacije7dana.push(this.rezervacije[i]);
        }
      }
    }

    getRezervacije30dana(){
      this.rezervacije30dana = [];
      let danas = new Date();
      for(let i = 0; i < this.rezervacije.length; i++){
        let datum = new Date(this.rezervacije[i].pocetak);
        let razlika = danas.getTime() - datum.getTime();
        let razlikaDani = Math.floor(razlika / (1000 * 3600 * 24));
        // Check if the date is in the past and within the last 30 days
        if(razlikaDani >= 0 && razlikaDani <= 30){
          this.rezervacije30dana.push(this.rezervacije[i]);
        }
      }
    }

    getRezervacije24h(){
      this.rezervacije24h = [];
      let danas = new Date();
      for(let i = 0; i < this.rezervacije.length; i++){
        let datum = new Date(this.rezervacije[i].pocetak);
        let razlika = danas.getTime() - datum.getTime();
        let razlikaSati = razlika / (1000 * 3600);
        if(razlikaSati >= 0 && razlikaSati <= 24){
          this.rezervacije24h.push(this.rezervacije[i]);
        }
      }
    }

    searchRestaurants(){
      this.search = false;
      for(let i = 0; i < this.restorani.length; i++){
        if(this.searchName != "" && this.searchAddress == "" && this.searchType == "" && this.restorani[i].naziv == this.searchName){
          this.searcResult.push(this.restorani[i]);
        }
        else if(this.searchAddress != "" && this.searchName == "" && this.searchType == "" && this.restorani[i].adresa == this.searchAddress){
          this.searcResult.push(this.restorani[i]);
        }
        else if(this.searchType != "" && this.searchName == "" && this.searchAddress == "" && this.restorani[i].tip == this.searchType){
          this.searcResult.push(this.restorani[i]);
        }
        else if(this.searchName != "" && this.searchAddress != "" && this.searchType == "" && this.restorani[i].naziv == this.searchName && this.restorani[i].adresa == this.searchAddress){
          this.searcResult.push(this.restorani[i]);
        }
        else if(this.searchName != "" && this.searchType != "" && this.searchAddress == "" && this.restorani[i].naziv == this.searchName && this.restorani[i].tip == this.searchType){
          this.searcResult.push(this.restorani[i]);
        }
        else if(this.searchAddress != "" && this.searchType != "" && this.searchName == "" && this.restorani[i].adresa == this.searchAddress && this.restorani[i].tip == this.searchType){
          this.searcResult.push(this.restorani[i]);
        }
        else if(this.searchName != "" && this.searchAddress != "" && this.searchType != "" && this.restorani[i].naziv == this.searchName && this.restorani[i].adresa == this.searchAddress && this.restorani[i].tip == this.searchType){
          this.searcResult.push(this.restorani[i]);
        }
      }
      this.searchDone = true;
      if(this.searcResult.length == 0){
        alert("Nema pronađenih restorana po zadatim kriterijumima pretrage.");
      }
    }
    reload(){
      this.getAllRestorani();
      this.searchDone = false;
      this.searcResult = [];
      this.searchName = "";
      this.searchType = "";
      this.searchAddress = "";
    }

    setsearch(){
      this.search = true;
    }

    sortNameRastuce(){
      this.restorani.sort((a, b) => (a.naziv > b.naziv) ? 1 : -1);
    }

    sortNameOpadajuce(){
      this.restorani.sort((a, b) => (a.naziv < b.naziv) ? 1 : -1);
    }

    sortTipRastuce(){
      this.restorani.sort((a, b) => (a.tip > b.tip) ? 1 : -1);
    }
    sortTipOpadajuce(){
      this.restorani.sort((a, b) => (a.tip < b.tip) ? 1 : -1);
    }
    sortAdresaRastuce(){
      this.restorani.sort((a, b) => (a.adresa > b.adresa) ? 1 : -1);
    }
    sortAdresaOpadajuce(){
      this.restorani.sort((a, b) => (a.adresa < b.adresa) ? 1 : -1);
    }
}
