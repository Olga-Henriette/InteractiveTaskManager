const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Charger les variables d'environnement
dotenv.config();

// Importer les routes (à créer à l'étape suivante)
const taskRoutes = require('./routes/tasks'); 

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
// Permet de lire le JSON envoyé dans le corps des requêtes (POST, PUT)
app.use(express.json());

// Configuration CORS pour autoriser l'accès depuis le frontend Next.js
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Routes
app.use('/api/tasks', taskRoutes);

// Connexion à MongoDB et Démarrage du Serveur
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connecté avec succès.');

        // Démarrer le serveur seulement après la connexion DB
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('Erreur de connexion à MongoDB:', err.message);
        process.exit(1); 
    }
};

connectDB();