import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PocetnaStranaComponent } from './pocetna-strana/pocetna-strana.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { ProfilComponent } from './profil/profil.component';
import { RestoraniComponent } from './restorani/restorani.component';
import { RestoranComponent } from './restoran/restoran.component';
import { RezervacijeComponent } from './rezervacije/rezervacije.component';
import { DostavaHraneComponent } from './dostava-hrane/dostava-hrane.component';
import { RezervacijeKonobarComponent } from './rezervacije-konobar/rezervacije-konobar.component';
import { DostaveComponent } from './dostave/dostave.component';
import { StatistikaComponent } from './statistika/statistika.component';
import { AdminComponent } from './admin/admin.component';
import { ZahteviComponent } from './zahtevi/zahtevi.component';
import { DodajKonobaraComponent } from './dodaj-konobara/dodaj-konobara.component';
import { DodajRestoranComponent } from './dodaj-restoran/dodaj-restoran.component';
import { RestoraniVremeComponent } from './restorani-vreme/restorani-vreme.component';

const routes: Routes = [
  {path: "", component: PocetnaStranaComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "profil", component: ProfilComponent},
  {path: "promenaLozinke", component: PromenaLozinkeComponent},
  {path: "restorani", component: RestoraniComponent},
  {path: "restoran", component: RestoranComponent},
  {path: "rezervacije", component: RezervacijeComponent},
  {path: "dostavaHrane", component: DostavaHraneComponent},
  {path: "rezervacijeKonobar", component: RezervacijeKonobarComponent},
  {path: "dostave", component: DostaveComponent},
  {path: "statistika", component: StatistikaComponent},
  {path: "admin", component: AdminComponent},
  {path: "zahtevi", component: ZahteviComponent},
  {path: "dodajKonobara", component: DodajKonobaraComponent},
  {path: "dodajRestoran", component: DodajRestoranComponent},
  {path: "restoraniRadnoVreme", component: RestoraniVremeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
