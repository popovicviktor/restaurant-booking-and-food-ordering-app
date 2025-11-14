import { Request, Response } from 'express';
import RestoranM from '../models/restoran';
import fs from 'fs';
import path from 'path';
import util from 'util';
import NarudzbinaM from '../models/narudzbina';
import narudzbina from '../models/narudzbina';

const readFile = util.promisify(fs.readFile);

// Define your controller class
class RestoranController {
    // Define your controller methods here
    // For example, a method to handle GET requests for all restaurants
    public getAllRestorani(req: Request, res: Response): void {
        RestoranM.find({}).then(async restorani => {
            for (let restoran of restorani) {
                for (let jelovnikItem of restoran.jelovnik) {
                    const imagePath = path.join('../backend/', jelovnikItem.slika);
                    try {
                        const image = await readFile(imagePath);
                        jelovnikItem.slika = `data:image/jpeg;base64,${image.toString('base64')}`;
                    } catch (err) {
                        console.error(`Error loading image for ${jelovnikItem.slika}:`, err);
                        jelovnikItem.slika = 'data:image/jpeg;base64,ERROR'; // Placeholder or error handling
                    }
                }
            }
            res.json(restorani);
        }).catch(err => {
            console.log(err);
            res.status(500).send('Error fetching restaurants');
        });
    }

    // Another example, a method to handle GET requests for a specific restaurant
    public getRestoranById(req: Request, res: Response): void {
        RestoranM.findById(req.params.id).then(restoran=>{
            res.json(restoran)
        }).catch((err)=>{
            console.log(err)
        })
    }

    public rezervisiSto(req: Request, res: Response) {
        RestoranM.updateOne({naziv: req.body.restoranNaziv}, 
            {$push: {rezervacije_aktuelne: req.body.rezervacija}}).then(data=>{
                res.json({message: "Ok"})
            }).catch(err=>{
                res.json({message: "Fail"})
            })
    }

    public naruci(req: Request, res: Response) {
        const narudzbina = req.body.narudzbina;
        narudzbina._id = new Date().getTime();
        NarudzbinaM.create(req.body.narudzbina).then(data=>{
            res.json({message: "ok"})
        }   ).catch(err=>{  
            res.json({message: "Fail"})
        })
    }

    public otkaziRezervaciju(req: Request, res: Response) {
        RestoranM.updateOne({naziv: req.body.rezervacija.restoran}, 
            {$pull: {rezervacije_aktuelne: req.body.rezervacija}}).then(data=>{
                res.json({message: "Ok"})
            }).catch(err=>{
                res.json({message: "fail"})
            })
    }
    public oceni(req: Request, res: Response) {
        RestoranM.updateOne({naziv: req.body.rezervacija.restoran}, 
            {$pull: {rezervacije_istekle: req.body.rezervacijaStara}}).then(data=>{
                console.log(req.body.rezervacijaStara);
                RestoranM.updateOne({naziv: req.body.rezervacija.restoran},{ $push: { rezervacije_istekle: req.body.rezervacija}}).then(data=>{
                    res.json({message: "Ok"})
                }).catch(err=>{
                    res.json({message: "fail"})
                })
            }).catch(err=>{
                res.json({message: "fail"})
            })
    }
    public getNarudzbine(req: Request, res: Response) {
        NarudzbinaM.find({}).sort({datum: -1}).then(data=>{
            res.json(data)
        }).catch(err=>{
            res.json({message: "Fail"})
        })
    }

    public prihvatiRezervaciju(req: Request, res: Response) {
        // Assuming `req.body.rezervacija` contains the reservation object with an `id` field
        const rezervacija = req.body.rezervacija;
        const restoranNaziv = req.body.rezervacija.restoran;
        const sto_id = req.body.stol;
    
        RestoranM.updateOne(
            { naziv: restoranNaziv, "rezervacije_aktuelne": rezervacija},
            { $set: { "rezervacije_aktuelne.$.status": "Odobreno",
                        "rezervacije_aktuelne.$.sto_id": sto_id,
                        "rezervacije_aktuelne.$.konobar": req.body.user
            }},
        ).then(data => {
            if (data.matchedCount === 0) {
                res.status(404).json({ message: "Rezervacija nije pronađena." });
            } else {
                res.json({ message: "ok" });
            }
        }).catch(err => {
            console.error(err);
            res.status(500).json({ message: "Fail" });
        });
    }

    odbijRezervaciju(req: Request, res: Response) {
        const rezervacija = req.body.rezervacija;
        RestoranM.updateOne({naziv: req.body.rezervacija.restoran}, 
            {$pull: {rezervacije_aktuelne: req.body.rezervacija}}).then(data=>{
                rezervacija.status = "Odbijeno";
                rezervacija.komentar = req.body.komentar;
                RestoranM.updateOne({naziv: req.body.rezervacija.restoran}, 
                    {$push: {rezervacije_istekle: rezervacija}}).then(data=>{
                        res.json({message: "Ok"})
                    }).catch(err=>{
                        res.json({message: "Error updating expired reservations", error: err})
                    });
            }).catch(err=>{
                res.json({message: "Error removing current reservation", error: err})
            })
    }

    pojavioSe(req: Request, res: Response) {
        RestoranM.updateOne({naziv: req.body.rezervacija.restoran, "rezervacije_aktuelne": req.body.rezervacija}, 
            {$set: {"rezervacije_aktuelne.$.status": "Izvrseno"}}).then(data=>{
                res.json({message: "Ok"})
            }).catch(err=>{
                res.json({message: "Fail"})
            })
    }

    arhivirajRezervaciju(req: Request, res: Response) {
        const rezervacija = req.body.rezervacija;
        RestoranM.updateOne({naziv: req.body.rezervacija.restoran}, 
            {$pull: {rezervacije_aktuelne: req.body.rezervacija}}).then(data=>{
                RestoranM.updateOne({naziv: req.body.rezervacija.restoran}, 
                    {$push: {rezervacije_istekle: rezervacija}}).then(data=>{
                        res.json({message: "Ok"})
                    }).catch(err=>{
                        res.json({message: "Error updating expired reservations", error: err})
                    });
            }).catch(err=>{
                res.json({message: "Error removing current reservation", error: err})
            })
    }

    prihvatiNarudzbinu(req: Request, res: Response) {
        NarudzbinaM.updateOne({_id: req.body.narudzbina._id}, { $set: {status: "prihvaceno", vreme: req.body.vreme} })
        .then(data => {
            res.json({message: "Ok"})
        })
        .catch(err => {
            res.status(500).json({message: "Fail", error: err})
        });
    }

    odbijNarudzbinu(req: Request, res: Response) {
        NarudzbinaM.updateOne({_id: req.body.narudzbina._id}, { $set: {status: "odbijeno"} })
        .then(data => {
            res.json({message: "Ok"})
        })
        .catch(err => {
            res.status(500).json({message: "Fail", error: err})
        }); 
    }

    zavrsiDostavu(req: Request, res: Response) {
        NarudzbinaM.updateOne({_id: req.body.narudzbina._id}, { $set: {status: "dostavljeno"} }).then(data => {
            res.json({message: "Ok"})
        }).catch(err => {
            res.status(500).json({message: "Fail", error: err})
        });
    }

    dodajKonobara(req: Request, res: Response) {
        RestoranM.updateOne({naziv: req.body.restoran}, 
            {$push: {konobari: req.body.user}}).then(data=>{
                res.json({message: "ok"})
            }).catch(err=>{
                res.json({message: "fail"})
            })
    }

    dodajRestoran(req: Request, res: Response) {
        RestoranM.create(req.body.restoran).then(data=>{
            res.json({message: "ok"})
        }).catch(err=>{
            res.json({message: "fail"})
        })
    }

    promeniRadnoVreme(req: Request, res: Response) {
        // Validate the presence of required fields
        if (!req.body.restoran || !req.body.restoran.naziv || !req.body.restoran.radno_vreme) {
            return res.status(400).json({ message: "fail", error: "Missing required fields" });
        }
    
        RestoranM.updateOne({ naziv: req.body.restoran.naziv }, { $set: { radno_vreme: req.body.restoran.radno_vreme } })
            .then(data => {
                if (data.matchedCount === 0) {
                    return res.status(404).json({ message: "fail", error: "Restoran not found" });
                }
                res.json({ message: "ok" });
            })
            .catch(err => {
                res.status(500).json({ message: "fail", error: err.toString() });
            });
    }

    // Add more methods as needed for your specific use case
}

export default RestoranController;