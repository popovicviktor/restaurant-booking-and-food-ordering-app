import mongoose from 'mongoose'

const restoranSchema = new mongoose.Schema(
    {       
    naziv: String,
	adresa: String,
	tip: String,
	opis: String,
	telefon: String,
	radno_vreme: Array,
	konobari: Array,
	stolovi: Array,
	rezervacije_aktuelne: Array,
	rezervacije_istekle: Array,
	jelovnik: Array,
	kuhinje: Array,
	toaleti: Array,
    },{
      versionKey:false  
    }
);

export default mongoose.model('RestoranModel',
restoranSchema, 'restorani');