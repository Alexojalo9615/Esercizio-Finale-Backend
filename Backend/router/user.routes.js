import { Router } from "express";
import User from "../models/User.js";

const router = Router(); // Creato un router vuoto

// Popoliamo il router con le rotte che ci servono
router.get('/users', async (req, res) => { // Quando arriverà una richiesta a questo indirizzo, gli passiamo la callback
  try {
    const users = await User.find(); // "find" è un metodo di un modello di database, che recupera tutti i documenti della collezione items
    res.json(users); // Invia una risposta JSON al client, è un metodo che converte l'oggetto 'users' in formato JSON e lo invia come risposta HTTP
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newUser = new User({ name, description }); // Viene creato un oggetto, User è un modello definito altrove nel codice, che rappresenta un'entità utente nel database. Si inizializza un nuovo utente 
    await newUser.save(); // Questa riga salva il nuovo utente nel database
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  // console.log(req.body);
  // res.send(req.body);
});

router.put('/users/:userId', async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { name, description },
      { new: true } // La funzione deve restituire il documento aggiornato
    );
    if (!updatedUser) {
      return res.status(404).send({ message: 'User non trovato' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send({ message: "Errore nell'aggiornare l'user", error });
  }
});

router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'User non trovato' });
    }
    res.status(200).send({ message: 'User cancellato con successo' });
  } catch (error) {
    res.status(500).send({ message: "Errore nel cancellare l'user", error });
  }
});

export default router;