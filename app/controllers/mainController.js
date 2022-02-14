
const { Quiz } = require('../models/');

const mainController = {
    // Middleware chargé de répondre à la requête du navigateur
    getHomePage: async (request, response) => {
        try {
            // console.log(request.session);
            // Si on ne met pas le await avant Quiz.findAll, on récupère l'instance de promesse, et on peut voir que cette instance est dans un status "pending" (en attente de récupération de donnée ou d'erreur)
            // Récupérer la liste des quizzes
            const quizList = await Quiz.findAll({
                // On demande à sequelise de créer une propriété "author" à tous nos quiz qui contiendra l'auteur de chaque quiz.
                include: ['author']
            });
            // La transmettre à la vue
            response.render('index', {
                quizList
            });

        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },

    
    pageNotFound: (request, response) => {
        response.status(404).render('notFound');
    }
};

module.exports = mainController;