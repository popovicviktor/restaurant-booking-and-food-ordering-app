import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Rezervacija } from '../models/rezervacija';
import { Restoran } from '../models/restoran';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistika',
  templateUrl: './statistika.component.html',
  styleUrls: ['./statistika.component.css']
})
export class StatistikaComponent implements OnInit, AfterViewInit {
  user: User = new User();
  rezervacijeSve: Rezervacija[] = [];
  restorani: Restoran[] = [];
  gostiPoDanima: number[] = [];
  gostiPoDanima1: number[] = [];
 konobari: string[] = [];
 brojRezervacijaPoKonobarima: string[] = [];

  constructor(private Uservis: UserService, private Rservis: RestoranService, private router: Router) {}

  ngOnInit(): void {
    let userString = localStorage.getItem("user");
    if (userString != null) {
      let userLCS = JSON.parse(userString);
      this.user = userLCS;
    }
    this.getAllRestorani();
  }

  ngAfterViewInit(): void {
  }

  getAllRestorani() {
    this.Rservis.getAllRestorani().subscribe(data => {
      this.restorani = data;
      this.restorani.forEach(restoran => {
        if (restoran.konobari.includes(this.user.korisnicko_ime)) {
          this.konobari = restoran.konobari;
          restoran.rezervacije_aktuelne.forEach(rezervacija => {
            if ((rezervacija.status === "Odobreno" || rezervacija.status == "Izvrseno") && rezervacija.konobar === this.user.korisnicko_ime) {
              this.rezervacijeSve.push(rezervacija);
            }
            for (let i = 0; i < this.konobari.length; i++) {
              if (this.konobari[i] === rezervacija.konobar) {
                this.brojRezervacijaPoKonobarima.push(rezervacija.konobar);
              }
            }
          });
          restoran.rezervacije_istekle.forEach(rezervacija => {
            if (rezervacija.konobar === this.user.korisnicko_ime && (rezervacija.status === "Odobreno" || rezervacija.status == "Izvrseno")) {
              this.rezervacijeSve.push(rezervacija);
            }
            for (let i = 0; i < this.konobari.length; i++) {
              if (this.konobari[i] === rezervacija.konobar) {
                this.brojRezervacijaPoKonobarima.push(rezervacija.konobar);
              }
            }
          });
        }
      });
      this.getGostiPoDanima();
      this.prikaziDijagram();
      this.getGostiPoDanima1();
      this.prikaziDijagram1();
      this.prikaziDijagramPita();
    });
  }

  getGostiPoDanima() {
    this.gostiPoDanima = [0, 0, 0, 0, 0, 0, 0];
    this.rezervacijeSve.forEach(rezervacija => {
      let datum = new Date(rezervacija.pocetak);
      let datumKraj = new Date(rezervacija.kraj);
      let dan = datum.getDay();
      let danKraj = datumKraj.getDay();
      this.gostiPoDanima[dan] += rezervacija.gosti;
      if (danKraj != dan){this.gostiPoDanima[danKraj] += rezervacija.gosti;}
    });
  }

  prikaziDijagram(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'], // Primer dana
        datasets: [{
          label: 'Broj gostiju',
          data: this.gostiPoDanima, // Primer podataka
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  getGostiPoDanima1() {
    const sumReservations = [0, 0, 0, 0, 0, 0, 0];
    let countReservations = 0;
    const averages = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    const today1 = new Date();
    const twentyFourMonthsAgo = new Date(today.setMonth(today.getMonth() - 24));

    // Filter reservations to the last 24 months
    const filteredReservations = this.rezervacijeSve.filter(rezervacija => {
      const startDate = new Date(rezervacija.pocetak);
      const endDate = new Date(rezervacija.kraj);
      return (startDate >= twentyFourMonthsAgo || endDate >= twentyFourMonthsAgo) && (startDate <= today1);
    });

    // Process reservations
    filteredReservations.forEach(rezervacija => {
      const startDate = new Date(rezervacija.pocetak);
      const dayOfWeek = startDate.getDay(); // Sunday - 0, Monday - 1, etc.
      const endDate = new Date(rezervacija.kraj);
      const endDateDayOfWeek = endDate.getDay();
      if(endDateDayOfWeek != dayOfWeek){
        sumReservations[endDateDayOfWeek] += 1;
        countReservations += 1;

      } // If reservation spans multiple days
      sumReservations[dayOfWeek] += 1; // Assuming each reservation counts as 1
      countReservations += 1;
    });

    // Calculate averages
    for (let i = 0; i < 7; i++) {
      if (countReservations > 0) {
        averages[i] = (sumReservations[i] / countReservations)*100;
      }
    }
    //prebaci averages u procente

    // Update the class property to use in the histogram
    this.gostiPoDanima1 = averages;
  }

  prikaziDijagram1(): void {
    const ctx = document.getElementById('myChart1') as HTMLCanvasElement;
    const myChart1 = new Chart(ctx, {
      type: 'bar', // Corrected from 'histogram' to 'bar'
      data: {
        labels: ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'], // Example days
        datasets: [{
          label: 'Broj rezervacija',
          data: this.gostiPoDanima1, // Example data
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  logout() {
    if (localStorage.getItem("logged") != null) {
      localStorage.removeItem("logged");
      localStorage.removeItem("user");
      localStorage.removeItem("restoran");
      this.router.navigate([""]);
    }
  }

  // Metoda za prikupljanje podataka i prikaz dijagrama "pita"
prikaziDijagramPita(): void {


  let brojGostiju = new Array(this.konobari.length).fill(0);
  for (let i = 0; i < this.konobari.length; i++) {
    for (let j = 0; j < this.brojRezervacijaPoKonobarima.length; j++) {
      if (this.konobari[i] === this.brojRezervacijaPoKonobarima[j]) {
        brojGostiju[i] += 1;
      }
    }
  }

  //const konobari = Object.keys(gostiPoKonobarima);
  //const brojGostiju = Object.values(gostiPoKonobarima);
  const konobari = this.konobari;

  const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;
  const myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: konobari,
      datasets: [{
        data: brojGostiju,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });
}
}
