import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { Restoran } from '../models/restoran';
import { RadnoVreme } from '../models/radno_vreme';

@Component({
  selector: 'app-restorani-vreme',
  templateUrl: './restorani-vreme.component.html',
  styleUrls: ['./restorani-vreme.component.css']
})
export class RestoraniVremeComponent implements OnInit{

  constructor(private servis: UserService, private restoranServis: RestoranService,
    private router: Router){}

    restorani: Restoran[] = [];
    view: string = "";
    restoran: Restoran = new Restoran();
    vremena: string[] = [];


    ngOnInit(): void {
      this.getAllRestorani();
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

  changeView(view: string){
    this.view = view;
  }

  promeni(restoran: Restoran){
    this.restoran = restoran;
    this.changeView("promeni");
  }

  promeni1() {
    if(this.vremena.length == 0){
      alert("Morate izmeniti bar jedno radno vreme restorana");
      return;
    }
    if(this.restoran.radno_vreme.length == 0){
      for (let i = 0; i < 7; i++) {
        this.restoran.radno_vreme.push(new RadnoVreme());
      }
    }
    const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    for (let i = 0; i < this.restoran.radno_vreme.length; i++) {
      if (this.vremena[i] != "" && this.vremena[i] != null) {
        const times = this.vremena[i].split("-");
        if (times.length === 2 && timeFormatRegex.test(times[0]) && timeFormatRegex.test(times[1])) {
          if(i == 0) this.restoran.radno_vreme[i].dan = "ponedeljak";
          if(i == 1) this.restoran.radno_vreme[i].dan = "utorak";
          if(i == 2) this.restoran.radno_vreme[i].dan = "sreda";
          if(i == 3) this.restoran.radno_vreme[i].dan = "cetvrtak";
          if(i == 4) this.restoran.radno_vreme[i].dan = "petak";
          if(i == 5) this.restoran.radno_vreme[i].dan = "subota";
          if(i == 6) this.restoran.radno_vreme[i].dan = "nedelja";
          this.restoran.radno_vreme[i].pocetak = times[0];
          this.restoran.radno_vreme[i].kraj = times[1];
        } else {
          alert("Radno vreme nije u dobrom formatu");
        }
      }
    }
    this.restoranServis.promeniRadnoVreme(this.restoran).subscribe(
      data=>{
        alert("Uspešno ste promenili radno vreme restorana");
        this.getAllRestorani();
        this.restoran = new Restoran();
        this.vremena = [];
        this.changeView("");
      }
    )
  }

}

