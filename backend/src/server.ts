import express from 'express';
import cors from 'cors'
import userRouter from './routers/user.router';
import mongoose from 'mongoose';
import path from 'path';
import restoranRouter from './routers/restoran.router';

const app = express();

app.use(cors())
app.use(express.json())


mongoose.connect('mongodb://127.0.0.1:27017/KutakDobreHrane')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("DB ok")
})


const router = express.Router()
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
router.use('/users', userRouter)
router.use('/restorani', restoranRouter)

app.use("/" ,router)
app.listen(4000, () => console.log(`Express server running on port 4000`));



