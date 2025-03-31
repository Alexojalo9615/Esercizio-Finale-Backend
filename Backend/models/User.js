import { model, Schema } from 'mongoose'


const userSchema = new Schema({

    guid: {
        type: String,
        // required: true, // Questo campo è richiesto 
        // unique: true // Deve essere unico
    },
    isActive: {
        type: Boolean,
        default: false // Di default è true
    },
    balance: {
        type: String,
    },
    picture: {
        type: String,
    },
    age: {
        type: Number,
    },
    eyeColor: {
        type: String,
        enum: ['blue', 'brown', 'green'], // L'Editor può modificare solo i propri articoli, l'Admin può fare tutto
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['Editor', 'Admin'],
        default: 'Editor'
    },
    company: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    about: {
        type: String,
    },
    registered: {
        type: String,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },
    tags: [{
        type: String,
    }],
    range: [{
        type: Number,
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    greeting: {
        type: String,
    },
    favoriteFruit: {
        type: String,
        enum: ['apple', 'banana', 'strawberry']
    },
    profileImg: {   
        type: String,
    },

}, { collection: 'users', timestamps: true } // Permette di salvare nel database la data di creazione e di modifica di un elemento
)


const User = model('User', userSchema) // Mongoose deve creare la collection su Mongo, prende il nome della risorsa e lo fa diventare plurale, minuscolo

export default User