import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema(
    {
        korisnicko_ime: String,
        lozinka: String,
        ime: String,
        prezime: String,
        pol: String,
        adresa: String,
        telefon: String,
        mejl: String,
        pitanje: String,
        odgovor: String,
        broj_kartice: String,
        tip: String,
        fotografija: String
        
    },{
      versionKey:false  
    }
);

export default mongoose.model('RequestModel', 
requestSchema, 'zahtevi')