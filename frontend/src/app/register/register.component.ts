import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Message } from '../models/message';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  constructor(private servis: UserService,
    private router: Router){}

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllZabranjeni();

  }
  users: User[] = [];
  message: string="";
  selectedFile: File | undefined = undefined;;
  secretKey: string = "secretKey";
  zabranjeni: User[] = [];

  user: User = new User();

  register() {
    this.user.tip = "gost"
    if(!this.user.korisnicko_ime){
      alert("Polje za korisničko ime ne može biti prazno")
      return;
    }
    if(this.zabranjeni.find(zabranjeni => zabranjeni.korisnicko_ime === this.user.korisnicko_ime)){
      alert("Korisnik sa ovim korisničkim imenom je zabranjen")
      return;
    }
    for(let i = 0; i< this.users.length; i++){
      if(this.users[i].korisnicko_ime == this.user.korisnicko_ime){
        alert(`Korisnik sa korisničkim imenom ${this.user.korisnicko_ime} već postoji`);
        return;
      }
    }
    if (!this.ProveraLozinke(this.user.lozinka)) {
      alert("REGISTRACIJA NEUSPEŠNA\nDužina lozinke mora biti između 6 i 10 karaktera\nLozinka mora sadržati minimum 1 veliko slovo\nLozinka mora sadržati minimum 3 mala slova\nLozinka mora sadržati minimum jedan broj\nLozinka mora sadržati minimum jedan specijalni karakter\nLozinka mora početi velikim slovom");
      return;
    }
    if(!this.user.pitanje){
      alert("Molimo unesite bezbednosno pitanje")
      return;
    }
    if(!this.user.odgovor){
      alert("Molimo unesite validan odgovor na bezbednosno pitanje")
      return;
    }
    if(!this.user.ime){
      alert("Polje za ime ne može biti prazno")
      return;
    }
    if(!this.user.prezime){
      alert("Polje za prezime ne može biti prazno")
      return;
    }
    if(!this.user.pol){
      alert("Molimo odaberite Vaš pol")
      return;
    }
    if(!this.user.adresa){
      alert("Molimo unesite Vašu adresu")
      return;
    }
    const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if(!pattern.test(this.user.telefon)){
      alert("Molimo unesite validan broj telefona u podržanom formatu: \n (123) 456-7890 \n123-456-7890 \n1234567890")
      return;
    }
    const sablon1 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!sablon1.test(this.user.mejl)){
      alert("Molimo unesite validnu e-mail adresu u podržanom formatu:\n username@example.com\n first.last@subdomain.example.co.uk\n username123@domain.net")
      return;
    }
    for(let i = 0; i< this.users.length; i++){
      if(this.users[i].mejl == this.user.mejl){
        alert(`Korisnik sa e-mail adresom: ${this.user.mejl} već postoji`);
        return;
      }
    }
    const sablon2 = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    if(!sablon2.test(this.user.broj_kartice)){
      alert("Molimo unesite validne informacije o kreditnoj kartici u podržanom formatu:\n XXXX-XXXX-XXXX-XXXX\n XXXX-XXXXXX-XXXXX")
      return;
    }
    if (this.selectedFile) {
      this.user.lozinka = this.encryptPassword(this.user.lozinka, this.secretKey);
      this.servis.register(this.user, this.selectedFile).subscribe(
        data => {
          if (data.message === "ok") alert("Zahtev je poslat i čeka na odobrenje");
          this.ngOnInit();
        }
      );
    } else {
      this.user.lozinka = this.encryptPassword(this.user.lozinka, this.secretKey);
      this.fetchDefaultImage().then((defaultImageFile) => {
        this.servis.register(this.user, defaultImageFile).subscribe(
          data => {
            if (data.message === "ok") alert("Zahtev je poslat i čeka na odobrenje");
            this.ngOnInit();
          }
        );
      })
    }
  }

  ProveraLozinke(lozinka: string): boolean {
    if (!lozinka) {
      return false;
    }

    const sablon = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*()\-_=+])[A-Za-z\d!@#$%^&*()\-_=+]{6,10}$/;
    return sablon.test(lozinka);
  }

  getAllUsers(){
    this.servis.getAllUsers().subscribe(
      data=>{
        this.users = data;
      }
    )
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (event) => {

    const img = new Image();
    img.src = event.target!.result as string;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      if (width < 100 || width > 300 || height < 100 || height > 300) {
        alert("Dimenzije slike moraju biti između 100x100px i 300x300px.")
        return;
      }
      this.selectedFile = file;
    };
  };
  }

  fetchDefaultImage(): Promise<File> {
    return fetch('assets/default.jpg')
        .then(response => {
            return response.blob();
        })
        .then(blob => new File([blob], 'default.jpg', { type: 'image/jpeg' }));
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

      getAllZabranjeni(){
        this.servis.getAllZabranjeni().subscribe(
          data=>{
            this.zabranjeni = data;
          }
        )
      }
}
