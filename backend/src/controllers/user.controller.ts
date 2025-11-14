import express from 'express'
import UserM from '../models/user'
import RequestM from '../models/request'
import ZabranjenM from '../models/zabranjen'
import fs, { readFile } from 'fs'
import path from 'path';

export class UserController{
    login = (req: express.Request, res: express.Response) => {
        let usernameP = req.body.username;
        let passwordP = req.body.password;
    
        UserM.findOne({ korisnicko_ime: usernameP, lozinka: passwordP }).then(async (users) => { // Made this function async
            if (users != null && users != undefined) {
                const imagePath = path.join('../backend/', users.fotografija ?? '');
                try {
                    const image = await new Promise<Buffer>((resolve, reject) => {
                        readFile(imagePath, (err, data) => {
                            if (err) {
                                console.error(`Error loading image for ${users.fotografija}:`, err);
                                users.fotografija = 'data:image/jpeg;base64,ERROR'; // Placeholder or error handling
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                    users.fotografija = `data:image/jpeg;base64,${image.toString('base64')}`;
                } catch (err) {
                    console.error(`Error loading image for ${users.fotografija}:`, err);
                    users.fotografija = 'data:image/jpeg;base64,ERROR'; // Placeholder or error handling
                }
            }
            res.json(users);
        }).catch((err) => {
            console.log(err);
        });
    }

    getAllUsers = async (req: express.Request, res: express.Response) => {
        try {
            const users = await UserM.find({});
            for (let user of users) {
                if (user != null && user !== undefined && user.fotografija) {
                    const imagePath = path.join('../backend/', user.fotografija);
                    try {
                        const image = await new Promise<Buffer>((resolve, reject) => {
                            readFile(imagePath, (err, data) => {
                                if (err) {
                                    console.error(`Error loading image for ${user.fotografija}:`, err);
                                    reject(err);
                                } else {
                                    resolve(data);
                                }
                            });
                        });
                        user.fotografija = `data:image/jpeg;base64,${image.toString('base64')}`;
                    } catch (err) {
                        console.error(`Error processing image for ${user.fotografija}:`, err);
                        user.fotografija = 'data:image/jpeg;base64,ERROR'; // Placeholder or error handling
                    }
                }
            }
            res.json(users);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error fetching users');
        }
    };

    register = (req: express.Request, res: express.Response)=>{
        const {
            korisnicko_ime,
            lozinka,
            ime,
            prezime,
            pol,
            adresa,
            telefon,
            mejl,
            pitanje,
            odgovor,
            broj_kartice,
            tip,
        } = req.body;
        let fotografija = "";
        // Check if the request contains a file
        if (req.file) {
            fotografija = req.file.path;;
        } 
        else fotografija = ""; // Path to uploaded file

        const newUser = new RequestM({
            korisnicko_ime,
            lozinka,
            ime,
            prezime,
            pol,
            adresa,
            telefon,
            mejl,
            pitanje,
            odgovor,
            broj_kartice,
            tip,
            fotografija,
        });

        newUser.save()
            .then(() => {
                res.json({ message: 'ok' });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ message: 'Failed to register user' });
            });
    }

    updatePassword = (req: express.Request, res: express.Response)=>{
        UserM.updateOne({korisnicko_ime: req.body.username},
            {lozinka: req.body.password}).then(users=>{
            res.json({message: "Password updated"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Password update failed"})
        })
    }

    updatePhoto = (req: express.Request, res: express.Response)=>{
        const filePath = req.file ? req.file.path : '';
        UserM.findOne({korisnicko_ime: req.body.username}).then(user=>{
            if(user === null) return res.json({message: "User not found"})
            if(user.fotografija !== "" && user.fotografija) fs.unlink(user.fotografija, (err)=>console.log(err))
            }).catch((err)=>{})
        UserM.updateOne({korisnicko_ime: req.body.username},
            {fotografija: filePath}).then(users=>{
            res.json({message: "Photo updated"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Photo update failed"})
        })
    }

    updateUser = (req: express.Request, res: express.Response)=>{
        const user = req.body.user;
        UserM.findOne({korisnicko_ime: user.korisnicko_ime}).then(user1=>{
            if (user1 !== null) {
                user.fotografija = user1.fotografija;
            }
            UserM.updateOne({korisnicko_ime: user.korisnicko_ime}, user).then(users=>{
                res.json({message: "User updated"})
            }).catch((err)=>{
                console.log(err)
                res.json({message: "User update failed"})
            })
        }).catch((err)=>{
            console.log(err)
            res.json({message: "User not found"})
        })
    }

    getAllRequests = (req: express.Request, res: express.Response)=>{
        RequestM.find({}).then(requests=>{
            res.json(requests)
        }).catch((err)=>{
            console.log(err)
        })
    }

    prihvati = (req: express.Request, res: express.Response)=>{
        const user = req.body;
        RequestM.deleteOne({korisnicko_ime: user.korisnicko_ime}).then(()=>{
            UserM.create(user).then(()=>{
                res.json({message: "User accepted"})
            }).catch((err)=>{
                console.log(err)
                res.json({message: "User not accepted"})
            })
        }).catch((err)=>{
            console.log(err)
            res.json({message: "User not accepted"})
        })
    }

    odbij = (req: express.Request, res: express.Response)=>{
        const user = req.body;
        RequestM.deleteOne({korisnicko_ime: user.korisnicko_ime}).then(()=>{
            ZabranjenM.create(user).then(()=>{
                res.json({message: "User rejected"})
            }).catch((err)=>{
                console.log(err)
                res.json({message: "User not rejected"})
            })
        }).catch((err)=>{
            console.log(err)
            res.json({message: "User not rejected"})
        })
    }

    getAllZabranjeni = (req: express.Request, res: express.Response)=>{
        ZabranjenM.find({}).then(users=>{
            res.json(users)
        }).catch((err)=>{
            console.log(err)
        })
    }
}