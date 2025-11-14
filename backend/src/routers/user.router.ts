import express from 'express';
import multer from 'multer';
import { UserController } from '../controllers/user.controller';
import user from '../models/user';

const userRouter = express.Router();
const userController = new UserController();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

userRouter.post('/register', upload.single('image'), (req, res) => userController.register(req, res));
userRouter.post('/login', (req, res) => userController.login(req, res));
userRouter.get('/getAllUsers', (req, res) => userController.getAllUsers(req, res));
userRouter.post('/updatePassword', (req, res) => userController.updatePassword(req, res));
userRouter.post('/updatePhoto', upload.single('image'), (req, res) => userController.updatePhoto(req, res));
userRouter.post('/updateUser', (req, res) => userController.updateUser(req, res));
userRouter.get('/getAllZahtevi', (req, res) => userController.getAllRequests(req, res));
userRouter.post('/prihvati', (req, res) => userController.prihvati(req, res));
userRouter.post('/odbij', (req, res) => userController.odbij(req, res));
userRouter.get('/getAllZabranjeni', (req, res) => userController.getAllZabranjeni(req, res));

export default userRouter;


