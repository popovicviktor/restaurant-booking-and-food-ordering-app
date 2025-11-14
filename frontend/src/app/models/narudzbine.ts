import { Narudzbina } from "./narudzbina";

export class Narudzbine{
  _id: string = "";
  narudzbine: Narudzbina[] = [];
  status: string = ""; // "zahtev", "prihvaceno", "odbijeno", "zavrseno"
  ukupna_cena: number = 0;
  restoran: string = "";
  datum: string = "";
  vlasnik: string = "";
  vreme: string = "";
}
