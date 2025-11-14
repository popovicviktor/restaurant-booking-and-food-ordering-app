import express, { Request, Response } from 'express';
import RestoranController from '../controllers/restoran.controller';

const restoranRouter = express.Router();


restoranRouter.get('/getAllRestorani', (req, res) => new RestoranController().getAllRestorani(req, res));

restoranRouter.post('/rezervisiSto', (req, res) => new RestoranController().rezervisiSto(req, res));

restoranRouter.post('/naruci', (req, res) => new RestoranController().naruci(req, res));

restoranRouter.post('/otkaziRezervaciju', (req, res) => new RestoranController().otkaziRezervaciju(req, res));

restoranRouter.post('/oceni', (req, res) => new RestoranController().oceni(req, res));

restoranRouter.get('/getNarudzbine', (req, res) => new RestoranController().getNarudzbine(req, res));

restoranRouter.post('/prihvati', (req, res) => new RestoranController().prihvatiRezervaciju(req, res));

restoranRouter.post('/odbij', (req, res) => new RestoranController().odbijRezervaciju(req, res));

restoranRouter.post('/pojavioSe', (req, res) => new RestoranController().pojavioSe(req, res));

restoranRouter.post('/arhiviraj', (req, res) => new RestoranController().arhivirajRezervaciju(req, res));

restoranRouter.post('/prihvatiNarudzbinu', (req, res) => new RestoranController().prihvatiNarudzbinu(req, res));

restoranRouter.post('/odbijNarudzbinu', (req, res) => new RestoranController().odbijNarudzbinu(req, res));

restoranRouter.post('/zavrsiDostavu', (req, res) => new RestoranController().zavrsiDostavu(req, res));

restoranRouter.post('/dodajKonobara', (req, res) => new RestoranController().dodajKonobara(req, res));

restoranRouter.post('/dodajRestoran', (req, res) => new RestoranController().dodajRestoran(req, res));

restoranRouter.post('/promeniRadnoVreme', (req, res) => new RestoranController().promeniRadnoVreme(req, res));

export default restoranRouter;