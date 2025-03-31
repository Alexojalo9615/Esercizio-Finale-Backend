import { Router } from 'express';
import Post from '../models/Post.js';
import { upload } from '../middlewares/cloudinaryConfig.js';


const router = Router(); // Creato un router vuoto


//GET tutti i post

router.get('/', async (req, res) => { // Quando arriverà una richiesta a questo indirizzo, gli passiamo la callback
    try {
        const page = parseInt(req.query.page) || 1; // Con parseInt convertiamo la stringa in un numero intero, se non c'è il parametro page, allora la pagina è 1
        const limit = parseInt(req.query.limit) || 3; // Con parseInt convertiamo la stringa in un numero intero, se non c'è il parametro limit, allora il limite è 3
        const skip = (page - 1) * limit; // Calcoliamo quanti documenti dobbiamo saltare

        const filter = req.query.author ? { author: req.query.author } : {}; // Questa riga controlla se nel query string della richiesta è presente il parametro author. Se lo è, allora il server utilizza il valore passato per filtrare i post per autore. Se non lo è, allora il server non applica alcun filtro e restituisce tutti i post. In questo modo, il server può restituire solo i post di un autore specifico se richiesto, altrimenti restituisce tutti i post disponibili.

        const totalPosts = await Post.countDocuments(filter); // Contiamo quanti documenti ci sono nella collezione
        const totalPages = Math.ceil(totalPosts / limit); // Calcoliamo il numero totale di pagine

        const posts = await Post.find(filter)
            .populate("author", "firstName lastName") // Gli sto dicendo di cercare tutti i post e di popolare il campo author con i campi firstName e lastName
            .skip(skip) // Salta i documenti
            .limit(limit) // Limita il numero di documenti che vogliamo ricevere
            .sort({ createdAt: -1 }); // Ordina i post in ordine decrescente in base alla data di creazione

        res.json({
            posts,
            page,
            totalPages,
            totalPosts
        });

        // Invia una risposta JSON al client, è un metodo che converte l'oggetto 'users' in formato JSON e lo invia come risposta HTTP
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET post per id

router.get('/:postsId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postsId).populate("author", "firstName lastName"); // Gli sto dicendo di cercare un post per id e di popolare il campo author con i campi firstName e lastName

        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//POST 

router.post('/', upload.single("cover"), async (req, res) => {
    try {

        console.log('Body:', req.body); // Stampa il body della richiesta per verificare se è corretto
        console.log('File:', req.file); // Stampa il file caricato per verificare se è corretto

        console.log("File ricevuto", req.file); // Stampa il file caricato per verificare se è corretto

        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "File non caricato" });
        }


        const { title, category, cover, content, readTime, author } = req.body;

        if (!title || !category || !req.file || !content || !author) {
            return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
        }


        const parsedReadTime = JSON.parse(readTime); // Il tempo di lettura è un oggetto, quindi lo dobbiamo parsare

        const newPost = new Post({
            title,
            category,
            cover: req.file.path, // Il percorso del file caricato da multer
            content,
            readTime: parsedReadTime, // Il tempo di lettura è un oggetto, quindi gli passo la variabile 'parsata'
            author
        }); // Viene creato un oggetto, User è un modello definito altrove nel codice, che rappresenta un'entità utente nel database. Si inizializza un nuovo utente 
        const savedPost = await newPost.save(); // Questa riga salva il nuovo utente nel database

        const populatedPost = await Post.findById(savedPost._id)
            .populate('author', 'firstName lastName');  // Popola i dati dell'autore prima di inviare la risposta

        res.status(201).json(populatedPost); // Invia una risposta JSON al client, è un metodo che converte l'oggetto 'users' in formato JSON e lo invia come risposta HTTP
    } catch (err) {
        res.status(500).json({
            message: 'Errore durante il salvataggio del post',
            error: err.message
        });
    }
});


//PUT
router.put('/:id', async (req, res) => {
    try {
        const { title, category, cover, content, readTime } = req.body;
        const post = await Post.findByIdAndUpdate(req.params.postId, {
            title,
            category,
            cover,
            content,
            readTime
        }, { new: true }); // Gli sto dicendo di cercare un post per id e di aggiornare i campi title, category, cover, content e readTime
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        }
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.postId); // Gli sto dicendo di cercare un post per id e di eliminarlo
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        }
        res.json({ message: 'Post eliminato' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router; 