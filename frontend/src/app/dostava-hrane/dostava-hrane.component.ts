import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Narudzbine } from '../models/narudzbine';

@Component({
  selector: 'app-dostava-hrane',
  templateUrl: './dostava-hrane.component.html',
  styleUrls: ['./dostava-hrane.component.css']
})
export class DostavaHraneComponent implements OnInit{
  constructor(private Uservis: UserService, private Rservis: RestoranService, private router: Router) { }


  user: User = new User();
  view: string = "";
  dostave: Narudzbine[] = [];

  ngOnInit(): void {
    let userString = localStorage.getItem("user");
    if(userString != null) {
      let userLCS = JSON.parse(userString);
      this.user = userLCS;
    }
    this.getNarudzbine();
  }

  logout(){
    if(localStorage.getItem("logged") != null){
      localStorage.removeItem("logged");
      localStorage.removeItem("user");
      localStorage.removeItem("restoran");
      this.router.navigate([""]);
    }
  }
  changeView(view: string) {
    this.view = view;
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

  getNarudzbine() {
    this.Rservis.getNarudzbine().subscribe(data => {
      for(let i = 0; i < data.length; i++) {
        if(data[i].vlasnik === this.user.korisnicko_ime) {
          this.dostave.push(data[i]);
        }
      }
    });
  }
}
