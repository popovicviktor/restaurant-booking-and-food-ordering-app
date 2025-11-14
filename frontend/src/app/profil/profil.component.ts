import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Restoran } from '../models/restoran';
import { RestoranService } from '../services/restoran.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent  implements OnInit{


  updateSelect: string="";

  constructor(private servis: UserService, private restoranServis: RestoranService,
    private router: Router){}

  user: User = new User();
  data: string="";
  iwtu: boolean = false;
  selectedFile: File | undefined = undefined;;
  users: User[] = [];
  restorani: Restoran[] = [];
  korisnikAdmin: User = new User();
  photo: string = "";

  ngOnInit(): void {
    let userString = localStorage.getItem("user");
    if(userString != null) {
      let userLCS = JSON.parse(userString);
      this.user = userLCS;
    }
    this.getAllUsers();
    this.getAllRestorani();
  }

  logout(){
    if(localStorage.getItem("logged") != null){
      localStorage.removeItem("logged");
      localStorage.removeItem("user");
      localStorage.removeItem("restoran");
      this.router.navigate([""]);
    }
  }

  apdejt(){
    if(this.updateSelect == "photo") return 0;
    else if(this.updateSelect == "") return 1;
    else return 2;
  }

  update(select: string){
    if(this.user.tip != "admin"){
    if(this.updateSelect == "photo"){
      if(this.selectedFile == undefined){
        alert("Odaberite sliku");
        return;
      }
      this.servis.updatePhoto(this.selectedFile, this.user.korisnicko_ime).subscribe((data: any) => {
        this.selectedFile = undefined;
        this.updateSelect = "";
        alert(data.message);
        this.getAllUsers();
        this.iwtu = false;
        this.ngOnInit();
      });
    }
    if(this.updateSelect=="mail"){
      if(this.data == ""){
        alert("Unesite Vašu e-mail adresu");
        return;
      }
        const sablon1 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if(!sablon1.test(this.data)){
      alert("Unesite e-mail adresu u podržanom formatu:\n username@example.com\n first.last@subdomain.example.co.uk\n username123@domain.net")
        return;
      }
      for(let i = 0; i< this.users.length; i++){
        if(this.users[i].mejl == this.data){
          alert(`Korisnik sa e-mail adresom: ${this.data} već postoji`);
          return;
        }
      }
      this.user.mejl = this.data;
      this.photo = this.user.fotografija;
      this.user.fotografija = "";
      this.servis.updateUser(this.user).subscribe((data: any) => {
        this.data = "";
        this.updateSelect = "";
        alert("E-mail addresa je ažurirana");
        this.getAllUsers();
        this.iwtu = false;
        this.user.fotografija = this.photo;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.ngOnInit();
      });
  }
    if(this.updateSelect == "name"){
      if(this.data == ""){
        alert("Unesite Vaše ime");
        return;
      }
      this.user.ime = this.data;
      this.photo = this.user.fotografija;
      this.user.fotografija = "";
      this.servis.updateUser(this.user).subscribe((data: any) => {
        this.data = "";
        this.updateSelect = "";
        alert("Ime je ažurirano");
        this.getAllUsers();
        this.iwtu = false;
        this.user.fotografija = this.photo;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.ngOnInit();
      });
    }
    if(this.updateSelect == "surname"){
      if(this.data == ""){
        alert("Unesite Vaše prezime");
        return;
      }
      this.user.prezime = this.data;
      this.photo = this.user.fotografija;
      this.user.fotografija = "";
      this.servis.updateUser(this.user).subscribe((data: any) => {
        this.data = "";
        this.updateSelect = "";
        alert("Prezime je ažurirano");
        this.getAllUsers();
        this.iwtu = false;
        this.user.fotografija = this.photo;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.ngOnInit();
      });
    }
    if(this.updateSelect == "address"){
      if(this.data == ""){
        alert("Uneiste Vašu adresu");
        return;
      }
      this.user.adresa = this.data;
      this.photo = this.user.fotografija;
      this.user.fotografija = "";
      this.servis.updateUser(this.user).subscribe((data: any) => {
        this.data = "";
        this.updateSelect = "";
        alert("Adresa je ažurirana");
        this.getAllUsers();
        this.iwtu = false;
        this.user.fotografija = this.photo;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.ngOnInit();
      });
    }
    if(this.updateSelect == "phone"){
      if(this.data == ""){
        alert("Unesite Vaš broj telefona");
        return;
      }
      const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
      if(!pattern.test(this.data)){
        alert("Unesite validan broj telefona u podržanom formatu: \n (123) 456-7890 \n123-456-7890 \n1234567890")
        return;
      }
      this.user.telefon = this.data;
      this.photo = this.user.fotografija;
      this.user.fotografija = "";
      this.servis.updateUser(this.user).subscribe((data: any) => {
        this.data = "";
        this.updateSelect = "";
        alert("Broj telefona je ažuriran");
        this.getAllUsers();
        this.iwtu = false;
        this.user.fotografija = this.photo;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.ngOnInit();
      });
    }
    if(this.updateSelect == "card"){
      if(this.data == ""){
        alert("Unesi broj platne kartice");
        return;
      }
      const sablon2 = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
      if(!sablon2.test(this.data)){
        alert("Unesite validan broj platne kartice u podržanom formatu:\n XXXX-XXXX-XXXX-XXXX\n XXXX-XXXXXX-XXXXX")
        return;
      }
      this.user.broj_kartice = this.data;
      this.photo = this.user.fotografija;
      this.user.fotografija = "";
      this.servis.updateUser(this.user).subscribe((data: any) => {
        this.data = "";
        this.updateSelect = "";
        alert("Broj platne kartice je ažuriran");
        this.getAllUsers();
        this.iwtu = false;
        this.user.fotografija = this.photo;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.ngOnInit();
      });
    }
    this.iwtu = false;
    this.korisnikAdmin = new User();
    }
    else{
      if(this.updateSelect == "photo"){
        if(this.selectedFile == undefined){
          alert("Odaberte sliku");
          return;
        }
        this.servis.updatePhoto(this.selectedFile, this.korisnikAdmin.korisnicko_ime).subscribe((data: any) => {
          this.selectedFile = undefined;
          this.updateSelect = "";
          alert(data.message);
          this.getAllUsers();
          this.iwtu = false;
        });
      }
      if(this.updateSelect=="mail"){
        if(this.data == ""){
          alert("Unesite Vašu e-mail adresu");
          return;
        }
          const sablon1 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if(!sablon1.test(this.data)){
        alert("Unesite e-mail adresu u podržanom formatu:\n username@example.com\n first.last@subdomain.example.co.uk\n username123@domain.net")
          return;
        }
        for(let i = 0; i< this.users.length; i++){
          if(this.users[i].mejl == this.data){
            alert(`Korisnik sa e-mail adresom: ${this.data} već postoji`);
            return;
          }
        }
        this.korisnikAdmin.mejl = this.data;
        this.photo = this.user.fotografija;
        this.user.fotografija = "";
        this.servis.updateUser(this.korisnikAdmin).subscribe((data: any) => {
          this.data = "";
          this.updateSelect = "";
          alert("E-mail je ažuriran");
          this.getAllUsers();
          this.iwtu = false;
          this.user.fotografija = this.photo;
          localStorage.setItem("user", JSON.stringify(this.user));
          this.ngOnInit();
        });
    }
      if(this.updateSelect == "name"){
        if(this.data == ""){
          alert("Unesite Vaše ime");
          return;
        }
        this.korisnikAdmin.ime = this.data;
        this.photo = this.korisnikAdmin.fotografija;
        this.korisnikAdmin.fotografija = "";
        this.servis.updateUser(this.korisnikAdmin).subscribe((data: any) => {
          this.data = "";
          this.updateSelect = "";
          alert("Ime je ažurirano");
          this.getAllUsers();
          this.iwtu = false;
          this.korisnikAdmin.fotografija = this.photo;
          localStorage.setItem("user", JSON.stringify(this.user));
          this.ngOnInit();
        });
      }
      if(this.updateSelect == "surname"){
        if(this.data == ""){
          alert("Unesite Vaše prezime");
          return;
        }
        this.korisnikAdmin.prezime = this.data;
        this.photo = this.korisnikAdmin.fotografija;
        this.korisnikAdmin.fotografija = "";
        this.servis.updateUser(this.korisnikAdmin).subscribe((data: any) => {
          this.data = "";
          this.updateSelect = "";
          alert("Prezime je ažurirano");
          this.getAllUsers();
          this.iwtu = false;
          this.korisnikAdmin.fotografija = this.photo;
          localStorage.setItem("user", JSON.stringify(this.user));
          this.ngOnInit();
        });
      }
      if(this.updateSelect == "address"){
        if(this.data == ""){
          alert("Unesite Vašu adresu");
          return;
        }
        this.korisnikAdmin.adresa = this.data;
        this.photo = this.korisnikAdmin.fotografija;
        this.korisnikAdmin.fotografija = "";
        this.servis.updateUser(this.korisnikAdmin).subscribe((data: any) => {
          this.data = "";
          this.updateSelect = "";
          alert("Adresa je ažurirana");
          this.getAllUsers();
          this.iwtu = false;
          this.korisnikAdmin.fotografija = this.photo;
          localStorage.setItem("user", JSON.stringify(this.user));
          this.ngOnInit();
        });
      }
      if(this.updateSelect == "phone"){
        if(this.data == ""){
          alert("Unesite broj telefona");
          return;
        }
        const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        if(!pattern.test(this.data)){
          alert("Unesite validan broj telefona u podržanom formatu: \n (123) 456-7890 \n123-456-7890 \n1234567890")
          return;
        }
        this.korisnikAdmin.telefon = this.data;
        this.photo = this.korisnikAdmin.fotografija;
        this.korisnikAdmin.fotografija = "";
        this.servis.updateUser(this.korisnikAdmin).subscribe((data: any) => {
          this.data = "";
          this.updateSelect = "";
          alert("Broj telefona je ažuriran");
          this.getAllUsers();
          this.iwtu = false;
          this.korisnikAdmin.fotografija = this.photo;
          localStorage.setItem("user", JSON.stringify(this.user));
          this.ngOnInit();
        });
      }
      if(this.updateSelect == "card"){
        if(this.data == ""){
          alert("Unesi broj platne kartice");
          return;
        }
        const sablon2 = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
        if(!sablon2.test(this.data)){
          alert("Unesite validan broj platne kartice u podržanom formatu:\n XXXX-XXXX-XXXX-XXXX\n XXXX-XXXXXX-XXXXX")
          return;
        }
        this.korisnikAdmin.broj_kartice = this.data;
        this.photo = this.korisnikAdmin.fotografija;
        this.korisnikAdmin.fotografija = "";
        this.servis.updateUser(this.korisnikAdmin).subscribe((data: any) => {
          this.data = "";
          this.updateSelect = "";
          alert("Broj platne kartice je ažuriran");
          this.getAllUsers();
          this.iwtu = false;
          this.korisnikAdmin.fotografija = this.photo;
          localStorage.setItem("user", JSON.stringify(this.user));
          this.ngOnInit();
        });
      }
      this.iwtu = false;
      this.korisnikAdmin = new User();
    }
  }

  IwantToUpdate(user1: User){
    this.korisnikAdmin = user1;
    this.iwtu = true;
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
        alert('Dimenzije slike moraju biti između 100x100 i 300x300 piksela.');
        return;
      }
      this.selectedFile = file;
    };
  };
  }

  getAllUsers(){
    this.servis.getAllUsers().subscribe(
      data=>{
        this.users = data;
      }
    )
  }

  getAllRestorani(){
    this.restoranServis.getAllRestorani().subscribe(
      data=>{
        this.restorani = data;
      }
    )
  }

  nazad(){
    this.iwtu = false;
    this.korisnikAdmin = new User();
    this.data = "";
    this.updateSelect = "";
  }


}
