import mongoose, { model, Schema } from "mongoose";


const userSchema = new Schema({

    firstName: {
        type: String,
        trim: true, // toglie gli spazi bianchi dall'inizio e dalla fine della stringa
        minlength: 2, // numero minimo di caratteri
        maxlength: 50, // numero massimo di caratteri
    },
    lastName: {
        type: String,
        required: true, // Questo campo è richiesto e obbligatorio
        trim: true,
        minlength: 2,
        maxlength: 50,
    },

    email: {
        type: String,
        required: true,
        unique: true, // La email deve essere unica
        lowercase: true, // Trasforma la strigna in minuscolo prima di salvarla 
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ], // Validazione dell'input attraverso una regex
    },
    passwordHash: String,
    isAdmin: {
        type: Boolean,
        default: false // Valore di default in cui il cmapo non venga passato
    },
    birthDate: {
        type: Date,
        min: '2020-02-16',
        max: Date.now, // data odierna come data massima
    },
    favoriteIceCream: {
        type: String,
        enum: ['cioccolato', 'vaniglia', 'pistacchio']
    },
    favoriteColors: {
        type: [String],
        default: [] // Gli array hanno il default automatico settato a []
    },
    addresses: {
        type: [
            {
                city: String,
                street: String,
                number: Number
            },
        ],

    },
})

const User = model('User', userSchema, 'utenti') // Mongoose deve creare la collection su Mongo, prende il nome della risorsa e lo fa diventare plurale, minuscolo


// schema per la risorsa Product
const schemaProduct = new Schema({
    name: {
        type: String,
        uppercase: true, // trasforma la stringa in maiuscolo prima di salvarla
        trim: true,
        required: true,
    },
    price: Number, // include sia numeri interi che con la virgola
    quantity: {
        type: Number,
        min: 0, // valora minimo accettabile
        max: 5000, // valore massimo accettabile
        validate: {
            // validazione custom per accettare solo numeri interi
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value',
        },
    },
});

const Product = model('Product', schemaProduct);

try {

const newUser = await User.create({ // Questa 'newUser' serve a creare un nuovo utente, utilizzando il model e lo Schema 

    firstName: "Gianfranco",
    lastName: "Rossi",
    email: "gianfra163@gmail.com",
    favoriteIceCream: "pistacchio",
    numeroCapelliInTesta: 50000, // questo campo non è definito nello schema quindi verrà ignorato
});

} catch (error) {

    console.log("L'utente non è stato creato");    
}

// console.log(newUser);


const theUser = await User.findById('67bf9a39162e0e4f499e1bc0') // Lettura libri di uno specifico utente
// console.log(theUser);

// lettura paginata di utenti multipli
const perPage = 2 
const page = 1; // request.query.page
const multipleUser = await User.where({}) 
.sort({ email: 1 })
.skip((page-1) * perPage)
.limit(perPage)
console.log(multipleUser);


// Modifica di uno specifico utente
const userModified = await User.findByIdAndUpdate('67bf9b7f1f831986e9d7bb3a', { 

    firstName: 'Pinco Star',
},
    { new: true } // Restituisce i dati modificati e non quelli originali
);
// console.log(userModified);

// Eliminazione di uno specifico utente
const userDeleted = await User.findByIdAndDelete('67bf9a39162e0e4f499e1bc0');
// console.log(userDeleted);

 // Chiusura connessione con MongoDB per evitare che resti aperta
mongoose.connection.close()