
const { Quiz, Tag } = require('../models/');
const sequelize = require('../database');

const quizController = {

    getOneQuiz: async (request, response, next) => {
        try {
            // Si l'user n'a pas propriété user dans sa session ou s'il n'est pas connecté
            // alors on le renvoie sur la page login avec un message erreur
            if (!request.session.user) {
                // Je stocke en session la page vers laquelle il faudra rediriger l'user une fois qu'il sera loggué 
                request.session.redirectAfterLogin = request.path;

                // au lieu de renvoyer le HTML du quiz, on lui envoie le HTML de la vue "login"
                return response.render('login', {
                    error: 'Veuillez vous connecter pour jouer !'
                });
            };


            // Récupérer un quiz
            const quiz = await Quiz.findByPk(request.params.id, {
                include:['tags','author', {
                    association: 'questions',
                    include: ['answers', 'level']
                }],
                order: [
                    // Trier les questions associés au Quiz par ordre alphabétiques
                    ['questions', 'question', 'ASC'],
                    // Puis mélanger les réponses (tri aléatoire)
                    sequelize.random(['questions','answers', 'description'])
                ]
            });

            // Vérifier si on récupère bien un quiz
            if (!quiz) { // Sinon, on renvoi une erreur
                throw new Error("Ce quiz n'existe pas");
            };

            // La transmettre à la vue
            if (request.session.user) {
                response.render('play-quiz', {
                    quiz,
                    title: quiz.title
                });
            } else {
                response.render('quiz', {
                    quiz,
                    title: quiz.title
                });
            };

        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        };
    },

    playQuiz: async (request, response) => {
        try {
            // Récupérer un quiz
            const quiz = await Quiz.findByPk(request.params.id, {
                include: [
                    { association: 'author'},
                    { association: 'questions', include: ['answers', 'level', 'good_answer']},
                    { association: 'tags'}
                ],
                order: [
                    // Trier les questions associés au Quiz par ordre alphabétiques
                    ['questions', 'question', 'ASC'],
                    // Puis mélanger les réponses (tri aléatoire)
                    sequelize.random(['questions','answers', 'description'])
                ]
            });

            // Vérifier si on récupère bien un quiz
            if (!quiz) { // Sinon, on renvoi une erreur
                throw new Error("Ce quiz n'existe pas");
            };


            // Création d'une variable pour compter les points !
            let points = 0;
            // pour chaque question
            for (let question of quiz.questions) {
                //  on vérifie si on a un input qui correspond (sinon l'utilisateur n'a pas répondu)
                let inputName = "question_"+question.id;
                if (request.body[inputName]) {
                    // ensuite on vérifie si c'est la bonne réponse
                    if(request.body[inputName] == question.good_answer.id) {
                        points ++; // on incrémente de 1 point
                    }
                }
            };

            // On renvoi les points à la vue
            response.render('quiz-results', {
                quiz,
                points,
                title: quiz.title,
                user_answers: request.body
            });

        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },

    listByTag: async (request, response) => {
        // plutot que de faire une requete compliquée
        // on va passer par le tag, et laisser les relations de Sequelize faire le taf !
        try {
            const tag = await Tag.findByPk(request.params.id,{
                include: [{
                    association: 'quizzes',
                    include: ['author']
                }]
            });
            const quizList = tag.quizzes;
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
    }

};

module.exports = quizController;