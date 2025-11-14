import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PocetnaStranaComponent } from './pocetna-strana/pocetna-strana.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProfilComponent } from './profil/profil.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
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


@NgModule({
  declarations: [
    AppComponent,
    PocetnaStranaComponent,
    LoginComponent,
    RegisterComponent,
    ProfilComponent,
    PromenaLozinkeComponent,
    RestoraniComponent,
    RestoranComponent,
    RezervacijeComponent,
    DostavaHraneComponent,
    RezervacijeKonobarComponent,
    DostaveComponent,
    StatistikaComponent,
    AdminComponent,
    ZahteviComponent,
    DodajKonobaraComponent,
    DodajRestoranComponent,
    RestoraniVremeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
