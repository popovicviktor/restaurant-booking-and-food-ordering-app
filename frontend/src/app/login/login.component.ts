import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private servis: UserService,
    private router: Router){}

  ngOnInit(): void {
    this.getAllUsers();
  }

  componentToDisplay: string = "login";
  users: User[] = [];
  username: string = ""
  password: string = ""
  answer: string = ""
  passwordConfirm: string = ""
  user: User = new User();
  secretKey: string = "secretKey";

  login(){
    let lozinka = this.encryptPassword(this.password, this.secretKey);
    this.servis.login(this.username, lozinka).subscribe(
      data=>{
        if(data==null) alert("Korisnik sa unetim korisničkim imenom i lozinkom ne postoji")
        else {
          if(data.tip == "gost"){
            localStorage.setItem("logged", data.korisnicko_ime)
            let userString = JSON.stringify(data);
            localStorage.setItem("user", userString);
            this.router.navigate(['profil'])
          }
          else if(data.tip == "konobar"){
            localStorage.setItem("logged", data.korisnicko_ime)
            let userString = JSON.stringify(data);
            localStorage.setItem("user", userString);
            this.router.navigate(['profil'])
          }
          else if(data.tip == "admin") alert("Ova forma je samo za goste i konobare") // ovo ukloniti
        }
      }
    )
  }
  getAllUsers(){
    this.servis.getAllUsers().subscribe(
      data=>{
        this.users = data;
      }
    )
  }
  userExists(){
    for(let user of this.users){
      if(user.korisnicko_ime == this.username) {
        this.user = user;
        return true
      };
    }
    return false;
  }

  changeDisplay(component: string){
    if(component == "login"){
      this.username = "";
      this.password = "";
      this.user = new User();
      this.passwordConfirm = "";
      this.answer = "";
      this.componentToDisplay = component;
      this.ngOnInit();  // da bi se ponovo ucitali korisnici
    }
    else{
    this.componentToDisplay = component;
    }
  }

  confirmUsername(){
    if(!this.userExists()){
      alert("Korisnik sa korisničkim imenom " + this.username + " ne postoji")
    }
    else{
      this.changeDisplay("securityQuestion")
    }
  }
  confirmAnswer(){
    if(this.answer == this.user.odgovor){
      this.changeDisplay("changePassword")
    }
    else alert("Pogrešan odgovor na bezbednosno pitanje")
  }

  changePassword(){
    if(this.password != this.passwordConfirm){
      alert("Lozinke se ne poklapaju")
    }
    else{
      if (!this.ProveraLozinke(this.password)) {
        alert("Ažuriranje lozinke nije uspelo\nDužina lozinke mora biti između 6 i 10 karaktera\nLozinka mora sadržati minimum 1 veliko slovo\nLozinka mora sadržati minimum 3 mala slova\nLozinka mora sadržati minimum jedan broj\nLozinka mora sadržati minimum jedan specijalni karakter\nLozinka mora početi velikim slovom")
        return;
      }
      let lozinka = this.encryptPassword(this.password, this.secretKey);
      this.servis.updateLozinka(this.user.korisnicko_ime, lozinka).subscribe(
        data=>{
          alert("Lozinka uspešno ažurirana");
          this.changeDisplay("login")
        }
      )
    }
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
