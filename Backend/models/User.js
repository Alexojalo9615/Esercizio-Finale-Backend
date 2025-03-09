import { model, Schema } from 'mongoose'


const userSchema = new Schema({

    name: String,
    description: {
        type: String,
        required: false // Questo campo è richiesto 
    },

    // email: {
    //     type: String,
    //     required: false,
    //     unique: true, // La email deve essere unica
    //     lowercase: true, // trasforma la stringa in minuscolo prima di salvarla
    //     trim: true,
    //     match: [
    //         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //         'Please fill a valid email address',
    //     ], // validazione dell'input attraverso una RegEx
    // },
    // isAdmin: {
    //     type: Boolean,
    //     default: false
    // },
    // birthDate: {
    //     type: Date,
    //     min: '2020-02-16',
    //     max: Date.now // data odierna come data massima
    // },
    // favoriteIceCream: {
    //     type: String,
    //     enum: ['cioccolato', 'vaniglia', 'pistacchio']
    // },
})


const User = model('User', userSchema) // Mongoose deve creare la collection su Mongo, prende il nome della risorsa e lo fa diventare plurale, minuscolo

export default User