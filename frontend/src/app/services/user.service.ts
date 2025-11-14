import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string){
    const data={
      username: username,
      password: password
    }
    return this.http.post<User>("http://localhost:4000/users/login", data)
  }

  getAllUsers(){
    return this.http.get<User[]>("http://localhost:4000/users/getAllUsers");
  }

  register(user: User, file?: File){
    const formData = new FormData();

    // Dodavanje korisničkih podataka
    formData.append('korisnicko_ime', user.korisnicko_ime);
    formData.append('lozinka', user.lozinka);
    formData.append('pitanje', user.pitanje);
    formData.append('odgovor', user.odgovor);
    formData.append('ime', user.ime);
    formData.append('prezime', user.prezime);
    formData.append('pol', user.pol);
    formData.append('adresa', user.adresa);
    formData.append('telefon', user.telefon);
    formData.append('mejl', user.mejl);
    formData.append('broj_kartice', user.broj_kartice);
    formData.append('tip', user.tip);

    // Dodavanje slike ako je dostupna
    if (file) {
      formData.append('image', file, file.name);
    }

    // Headers za multipart/form-data
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<Message>("http://localhost:4000/users/register", formData, { headers: headers })
  }

  updateLozinka(username: string, password: string){
    return this.http.post<Message>("http://localhost:4000/users/updatePassword",{username: username, password: password});
  }

  updatePhoto(file: File, username: string) {
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('username', username);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<Message>("http://localhost:4000/users/updatePhoto", formData, { headers: headers });
  }

  updateUser(user: User){
    return this.http.post<Message>("http://localhost:4000/users/updateUser",{user: user});
  }

  getAllZahtevi(){
    return this.http.get<User[]>("http://localhost:4000/users/getAllZahtevi");
  }

  prihvati(korisnik: User){
    return this.http.post<Message>("http://localhost:4000/users/prihvati", korisnik);
  }

  odbij(korisnik: User){
    return this.http.post<Message>("http://localhost:4000/users/odbij", korisnik);
  }

  getAllZabranjeni(){
    return this.http.get<User[]>("http://localhost:4000/users/getAllZabranjeni");
  }
}
