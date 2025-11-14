import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { RestoranService } from '../services/restoran.service';
import { Restoran } from '../models/restoran';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-dodaj-konobara',
  templateUrl: './dodaj-konobara.component.html',
  styleUrls: ['./dodaj-konobara.component.css']
})
export class DodajKonobaraComponent implements OnInit{

  constructor(private servis: UserService, private restoranServis: RestoranService,
    private router: Router){}

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllRestorani();
  }
  users: User[] = [];
  message: string="";
  selectedFile: File | undefined = undefined;;
  restorani: Restoran[] = [];
  zahtevi: User[] = [];
  restoran: string = "";
  sifra: string = "";

  user: User = new User();

  register() {
    this.user.tip = "konobar"
    if(!this.user.korisnicko_ime){
      alert("Morate uneti korisničko ime konobara")
      return;
    }
    if(!this.restoran){
      alert("Morate izabrati restoran u kojem će raditi konobar")
      return;
    }
    for(let i = 0; i< this.users.length; i++){
      if(this.users[i].korisnicko_ime == this.user.korisnicko_ime){
        alert(`Korisnik sa korisničkim imenom ${this.user.korisnicko_ime} već postoji`);
        return;
      }
    }
    if (!this.ProveraLozinke(this.sifra)) {
      alert("Registracija nije uspela\nDužina lozinke mora biti između 6 i 10 karaktera\nLozinka mora sadržati minimum 1 veliko slovo\nLozinka mora sadržati minimum 3 mala slova\nLozinka mora sadržati minimum jedan broj\nLozinka mora sadržati minimum jedan specijalni karakter\nLozinka mora početi velikim slovom")
      return;
    }
    if(!this.user.pitanje){
      alert("Polje za bezbednosno pitanje ne sme biti prazno")
      return;
    }
    if(!this.user.odgovor){
      alert("Polje za odgovor na bezbednosno pitanje ne sme biti prazno")
      return;
    }
    if(!this.user.ime){
      alert("Polje za ime ne sme biti prazno")
      return;
    }
    if(!this.user.prezime){
      alert("Polje za prezime ne sme biti prazno")
      return;
    }
    if(!this.user.pol){
      alert("Morate odabrati pol")
      return;
    }
    if(!this.user.adresa){
      alert("Morate uneti svoju adresu")
      return;
    }
    const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if(!pattern.test(this.user.telefon)){
      alert("Morate uneti broj telefona u podržanom formatu: \n (123) 456-7890 \n123-456-7890 \n1234567890")
      return;
    }
    const sablon1 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!sablon1.test(this.user.mejl)){
      alert("Morate uneti validnu e-mail adresu u podržanom formatu:\n username@example.com\n first.last@subdomain.example.co.uk\n username123@domain.net")
      return;
    }
    for(let i = 0; i< this.users.length; i++){
      if(this.users[i].mejl == this.user.mejl){
        alert(`Korisnik sa e-mail adresom: ${this.user.mejl} već postoji`);
        return;
      }
    }
    if (this.selectedFile) {
      this.user.lozinka = this.encryptPassword(this.sifra, "secretKey");
      this.servis.register(this.user, this.selectedFile).subscribe(
        data => {
          if (data.message === "ok"){
            this.servis.getAllZahtevi().subscribe(
              data=>{
                this.zahtevi = data;
                for(let i = 0; i< this.zahtevi.length; i++){
                  if(this.zahtevi[i].korisnicko_ime == this.user.korisnicko_ime){
                    this.servis.prihvati(this.zahtevi[i]).subscribe(
                      data => {
                        if (data.message == "User accepted") {
                          this.restoranServis.dodajKonobara(this.user.korisnicko_ime, this.restoran).subscribe(
                            data=>{
                                alert("Novi konobar je uspešno dodat");
                                this.restoran = "";
                                this.user = new User();
                                this.sifra = "";
                                this.getAllUsers();
                                this.getAllRestorani();
                            }
                          )
                        }
                      }
                    )
                  }
                }
              }
            )
          }
          else{
            alert("Neuspešno dodavanje konobara")
          }
        }
      );
    } else {
      this.user.lozinka = this.encryptPassword(this.sifra, "secretKey")
      this.fetchDefaultImage().then((defaultImageFile) => {
        this.servis.register(this.user, defaultImageFile).subscribe(
          data => {
            if (data.message === "ok"){
              this.servis.getAllZahtevi().subscribe(
                data=>{
                  this.zahtevi = data;
                  for(let i = 0; i< this.zahtevi.length; i++){
                    if(this.zahtevi[i].korisnicko_ime == this.user.korisnicko_ime){
                      this.servis.prihvati(this.zahtevi[i]).subscribe(
                        data => {
                          if (data.message == "User accepted") {
                            this.restoranServis.dodajKonobara(this.user.korisnicko_ime, this.restoran).subscribe(
                              data=>{
                                  alert("Novi konobar je uspešno dodat");
                                  this.restoran = "";
                                  this.user = new User();
                                  this.sifra = "";
                                  this.getAllUsers();
                                  this.getAllRestorani();
                              }
                            )
                          }
                          else{
                            alert("Neuspešno dodavanje konobara")
                          }
                        }
                      )
                    }
                  }
                }
              )
            }
            else{
              alert("Neuspešno dodavanje konobara")
            }
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
        alert('Dimenzije slike moraju biti između 100x100 i 300x300 piksela');
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

      logout(){
        if(localStorage.getItem("logged") != null){
          localStorage.removeItem("logged");
          localStorage.removeItem("user");
          localStorage.removeItem("restoran");
          this.router.navigate([""]);
        }
      }

      getAllRestorani(){
        this.restoranServis.getAllRestorani().subscribe(
          data=>{
            this.restorani = data;
          }
        )
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
