import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-zahtevi',
  templateUrl: './zahtevi.component.html',
  styleUrls: ['./zahtevi.component.css']
})
export class ZahteviComponent implements OnInit{

  constructor(private servis: UserService, private restoranServis: RestoranService,
    private router: Router){}

    user: User = new User();
    zahtevi: User[] = [];

    ngOnInit(): void {
      let userString = localStorage.getItem("user");
      if(userString != null) {
        let userLCS = JSON.parse(userString);
        this.user = userLCS;
      }
      this.getAllZahtevi();
    }


    logout(){
      if(localStorage.getItem("logged") != null){
        localStorage.removeItem("logged");
        localStorage.removeItem("user");
        localStorage.removeItem("restoran");
        this.router.navigate([""]);
      }
    }

    getAllZahtevi(){
      this.servis.getAllZahtevi().subscribe(data => {
        this.zahtevi = data;
      });
    }

    prihvati(korisnik: User){
      this.servis.prihvati(korisnik).subscribe(data => {
        if(data.message == "User accepted"){
          alert("Zahtev uspešno prihvaćen");
        }
        else{
          alert("Došlo je do greške");
        }
        this.getAllZahtevi();
      });
    }

    odbij(korisnik: User){
      this.servis.odbij(korisnik).subscribe(data => {
        if(data.message == "User rejected"){
          alert("Zahtev uspešno odbijen");
        }
        else{
          alert("Došlo je do greške");
        }
        this.getAllZahtevi();
      });
    }

}
