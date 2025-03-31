
import dotenv from 'dotenv' //carica il file .env
dotenv.config({ path: './.env' });

import {v2 as cloudinary} from 'cloudinary';
import  multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({ // Creazione di un oggetto di archiviazione per multer
    cloudinary: cloudinary, // Cloudinary è l'oggetto di configurazione di Cloudinary
    params: {
        folder: 'blog_posts', // Cartella in cui verranno salvate le immagini
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formati consentiti
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // Trasformazione dell'immagine
    }
});

const upload = multer({storage: storage}) // Creazione di un oggetto multer con la configurazione di archiviazione e il nome del campo del file
// Questo middleware configura Cloudinary e Multer per caricare immagini sul cloud



export {cloudinary, upload}