
export class Rezervacija{
  sto_id: number=0;
  vlasnik: string=""  // Ovo je ustvari username;
  pocetak: string="";
  kraj: string="";
  status: string="";  // "Zahtev", "Odobreno", "Odbijeno"
  gosti: number=0;    // Broj gostiju
  napomena: string="";
  komentar: string="";
  ocena: number=0;
  restoran: string="";
  konobar: string="";
}
