import mongoose from 'mongoose'

const NarudzbinaSchema = new mongoose.Schema(
    {
        narudzbine: Array,
        status: String,
        ukupna_cena: Number,
        restoran: String,
        datum: String,
        vlasnik: String,
        vreme: String,
        _id: String,
    },{
      versionKey:false  
    }
);

export default mongoose.model('NarudzbinaModel', 
    NarudzbinaSchema, 'narudzbine');