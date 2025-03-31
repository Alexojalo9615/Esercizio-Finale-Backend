import { Router } from "express";
import User from "../models/User.js";

const router = Router(); // Creato un router vuoto

// Popoliamo il router con le rotte che ci servono
router.get('/', async (req, res) => { // Quando arriverà una richiesta a questo indirizzo, gli passiamo la callback
  try {
    const users = await User.find().select("-password"); // "find" è un metodo di un modello di database, che recupera tutti i documenti della collezione items. Il campo "-password" esclude il campo password dalle chiamate GET
    res.json(users); // Invia una risposta JSON al client, è un metodo che converte l'oggetto 'users' in formato JSON e lo invia come risposta HTTP
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//isActive: true 

router.get('/active', async (req, res) => {
  try {
    const activeUsers = await User.find({ isActive: true }); // uso 'find' per trovare gli utenti attivi e lo salvo in una variabile
    res.json(activeUsers); // Invia una risposta JSON al client, è un metodo che converte l'oggetto 'users' in formato JSON e lo invia come risposta HTTP    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST registrazione 

router.post('/register', async (req, res) => {

  try {
    const { firstName, lastName, email, password } = req.body;

    // Verifica se l'utente esiste già
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utente già registrato' });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    }); // Viene creato un oggetto, User è un modello definito altrove nel codice, che rappresenta un'entità utente nel database. Si inizializza un nuovo utente 
    await newUser.save(); // Questa riga salva il nuovo utente nel database

    //Non inviare la password nella risposta
    const userWithoutPassword = newUser.toObject(); // Il metodo "toObject" crea una copia dell'oggetto Mongoose restituendo un semplice oggetto JavaScript
    delete userWithoutPassword.password; // Questa riga elimina la password dall'oggetto. In questo modo l'oggetto non conterrà la password dell'utente

    res.status(201).json(userWithoutPassword);
  } catch (err) {

    console.error("Errore nella registrazione:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST login

router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // Cerca un utente nel database con l'email fornita
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    } // Se l'utente non esiste, restituisce un errore


    if (user.password !== password) {
      return res.status(401).json({ message: 'Password errata' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { name, description },
      { new: true } // La funzione deve restituire il documento aggiornato
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User non trovato' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornare l'user", error });
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User non trovato' });
    }
    res.status(200).json({ message: 'User cancellato con successo' });
  } catch (error) {
    res.status(500).json({ message: "Errore nel cancellare l'user", error });
  }
});

router.put('/:userId/activate', async (req, res) => {
  try {
    const { firstName, lastName, currentPassword, newPassword } = req.body;


    const newUser = {firstName, lastName, email, newPassword};

    const user = await User.findByIdAndUpdate(
      req.params.userId
    );
    if (!user) {
      return res.status(404).json({ message: 'User non trovato' });
    }
    if (currentPassword && user.password !== user.password) {
      return res.status(401).json({ message: 'Password errata' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.password = newPassword || currentPassword;
    await user.save(); // Salva le modifiche all'utente nel database
    res.status(200).json(user); // Restituisce l'utente aggiornato

  } catch (error) {
    res.status(500).json({ message: "Errore nell'attivare l'user", error });
  }
});

export default router;