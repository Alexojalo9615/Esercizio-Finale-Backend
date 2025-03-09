import dotenv from 'dotenv' //carica il file .env
dotenv.config({ path: './.env' });
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from './router/user.routes.js'


console.log("Avvio del server...");
console.log("Provo a connettermi a MongoDB...", process.env.MONGO_STRING);


const server = express() // Questa chiamata mi inizializza un server, lo creo che non fa niente
server.use(cors()) // Questo mi permette di fare richieste da un server a un altro, in questo caso il server di React a quello di Express. Si sta facendo una connessione tra frontend e backend, in particolare il frontend sta inviando richieste HTTP al backend
server.use(express.json())// Dicendogli questo il nostro server sarà in grado di "parsare" il body di tipo json


async function avviaServer() {
    try {
        
        await mongoose.connect(process.env.MONGO_STRING, {

            useNewUrlParser: true,
            useUnifiedTopology: true,

        }) // Col metodo 'connect()' si stabilisce una connessione al database MongoDB, usando in questo caso la connection string e accetta una stringa che nclude informazioni al suo interno come l'URL , il server MongoDb, il nome del database ed eventualmente le chiavi di autenticazione. Mentre mongoose è una libreria di MongoDB

        console.log("Connesso a MongoDB!");

        server.use(userRouter); // Associo il server al router, gli dico di usarlo

        server.listen(process.env.PORT || 5020, () => {
            // console.clear()
            console.log("Server avviato!");
        })

    } catch (error) {
        console.error("Errore di connessione a MongoDB:", error);
    }
}

avviaServer() // Questa funzione avvia il server