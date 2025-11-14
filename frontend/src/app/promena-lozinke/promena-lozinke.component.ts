import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-promena-lozinke',
  templateUrl: './promena-lozinke.component.html',
  styleUrls: ['./promena-lozinke.component.css']
})
export class PromenaLozinkeComponent implements OnInit{

oldPassword: string="";
newPassword: string="";
confirmPassword: string="";
secretKey: string = "secretKey";

  constructor(private servis: UserService,
    private router: Router){}

    user: User = new User();

  ngOnInit(): void {
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

    changeP(){
      let staraLozinka = this.encryptPassword(this.oldPassword, this.secretKey);
      if(staraLozinka == this.user.lozinka && this.newPassword == this.confirmPassword){
        if (!this.ProveraLozinke(this.newPassword)) {
          alert("Ažuriranje lozinke nije uspelo\n Lozinka mora da sadrži minimum 6 karaktera i maksimum 10 karaktera\nLozinka mora da sadrži minimum 1 veliko slovo\nLozinka mora da sadrži minimum 3 mala slova\nLozinka mora da sadrži minimum 1 broj\nLozinka mora da sadrži minimum 1 specijalni karakter\nLozinka mora da počinje velikim slovom")
          return;
        }
        let novaLozinka = this.newPassword;
        this.oldPassword = "";
        this.confirmPassword = "";
        novaLozinka = this.encryptPassword(this.newPassword, this.secretKey);
        this.newPassword = "";
        this.servis.updateLozinka(this.user.korisnicko_ime, novaLozinka).subscribe(
          data=>{
            this.user.lozinka = novaLozinka;
            alert("Uspešno ažurirana lozinka")
          }
        )
      }
      else alert("Ažuriranje lozinke nije uspelo, proverite unete podatke")
    }

    ProveraLozinke(lozinka: string): boolean {
      if (!lozinka) {
        return false;
      }

      const sablon = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*()\-_=+])[A-Za-z\d!@#$%^&*()\-_=+]{6,10}$/;
      return sablon.test(lozinka);
    }

    encryptPassword(password: string, secretKey: string): string {
      const iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // Konstantan IV za demonstraciju
      const key = CryptoJS.enc.Utf8.parse(secretKey);
      const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();
    }

    decryptPassword(encryptedPassword: string, secretKey: string): string {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey, { mode: CryptoJS.mode.ECB });
      return bytes.toString(CryptoJS.enc.Utf8);
    }
  }
