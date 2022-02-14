// Les variables d'environnement
require('dotenv').config();

// Configuration du PORT
const PORT = process.env.PORT;


// Import du middleware express
const express = require('express');
// Exécution de express ("app." est le retour de la fonction express)
const app = express();
// Rendre les vues avant le app.use(router)
app.set('view engine', 'ejs'); // On spécifie le moteur de rendu. (Pas besoin de require ejs, express se débrouille)
app.set('views', __dirname + '/app/views'); // On précise où se trouvent les vues
// Chemin des fichiers statiques
app.use(express.static(__dirname + '/public'));
// Gestion de payload (corp du messageou bodyparser) POST body. Fourni par express, A mettre avant le Router, afin que les Controllers puissent lire le contenu.
app.use(express.urlencoded({ extended: true })); // A chaque requête post, une propriété "body" sera lu


// Import du middleware express-session pour gérer des sessions
const session = require('express-session');
// Configuration des sessions
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'Un Super Secret' // qui permet d'encoder nos cookies (seule option required)
}));


// Import du middleware maison, pour initialiser une propriété "user" en ojet vide et ne pas générer d'erreur lorsqu'on a pas récupéré d'user
const userMiddleware = require('./app/middlewares/userMiddleware');
app.use(userMiddleware);


// Import du routeur configurer dans le fichier router.js
const router = require('./app/router');
app.use(router);


// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré, -> http://localhost:${PORT}`);
});