import { Jelo } from "./jelo";
import { Pravougaonik } from "./pravougaonik";
import { RadnoVreme } from "./radno_vreme";
import { Rezervacija } from "./rezervacija";
import { Sto } from "./sto";

export class Restoran{
  naziv: string="";
	adresa: string="";
	tip: string="";     // "Kafana", "Kafic", "Restoran", "Brza hrana"
	opis: string="";
	telefon: string="";
	radno_vreme: RadnoVreme[]=[];
	konobari: string[]=[]; // Korisnička imena konobara
	stolovi: Sto[]=[];
	rezervacije_aktuelne: Rezervacija[]=[];
  rezervacije_istekle: Rezervacija[]=[];
  jelovnik: Jelo[]=[];
  kuhinje: Pravougaonik[]=[];
  toaleti: Pravougaonik[]=[];
}
