import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { Restoran } from '../models/restoran';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-restorani',
  templateUrl: './restorani.component.html',
  styleUrls: ['./restorani.component.css']
})
export class RestoraniComponent implements OnInit{
  restorani: Restoran[] = [];
  users: User[] = [];
  search: boolean = false;
  searchName: string = "";
  searchType: string = "";
  searchAddress: string = "";
  searcResult: Restoran[] = [];
  searchDone = false;


  constructor(private Uservis: UserService, private Rservis: RestoranService, private router: Router) { }


  ngOnInit(): void {
    this.getAllRestorani();
    this.getAllUsers();
  }
  getAllUsers() {
    this.Uservis.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  getAllRestorani() {
    this.Rservis.getAllRestorani().subscribe(data => {
      this.restorani = data;
    });
  }

  logout(){
    if(localStorage.getItem("logged") != null){
      localStorage.removeItem("logged");
      localStorage.removeItem("user");
      localStorage.removeItem("restoran");
      this.router.navigate([""]);
    }
  }
  setsearch(){
    this.search = true;
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
  prosecnaOcena(restoranNaziv: string){
    for(let restoran of this.restorani){
      if(restoran.naziv == restoranNaziv){
        let sum = 0;
        let count = 0;
        for(let rezervacija of restoran.rezervacije_istekle){
          if(rezervacija.status == "Izvrseno"){
            sum += rezervacija.ocena;
            count++;
          }
        }
        if(count > 0){
          const average = sum / count;
          // Zaokruživanje na dve decimale i konverzija nazad u broj
          return parseFloat(average.toFixed(2));
        }
      }
    }
    return 0;
  }
  getZvezdice(prosecnaOcena: number){
    let zvezdice = "";
    for(let i = 0; i< prosecnaOcena; i++){
      zvezdice += "★";
    }
    return zvezdice;
  }

  restoranDetalji(naziv: string){
    for(let restoran of this.restorani){
      if(restoran.naziv == naziv){
        localStorage.setItem("restoran", JSON.stringify(restoran));
        break;
      }
    }
    this.router.navigate(['/restoran']);
  }
}
