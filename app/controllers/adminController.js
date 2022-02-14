
const { Tag, Quiz, User } = require('../models/');

const adminController = {
    adminPage: async (request, response) => {
        response.render('admin');
    },

    
    adminAddPage: async (request, response) => {
        response.render('admin/addtag');
    },


    adminAddTag: async (request, response) => {
        try {
            // Si l'user n'a pas propriété user dans sa session ou s'il n'est pas connecté
            // alors on le renvoie sur la page login avec un message erreur
            if (!request.session.user) {
                // Je stocke en session la page vers laquelle il faudra rediriger l'user une fois qu'il sera loggué 
                request.session.redirectAfterLogin = request.path;

                // au lieu de renvoyer le HTML du quiz, on lui envoie le HTML de la vue "login"
                return response.render('login', {
                    error: 'Veuillez vous connecter pour accéder à la base !'
                });
            };

            // Si l'user connecté n'a pas le role admin
            if (request.session.user.role !== 'admin') {
                // J'affiche la vue "INTERDIT !"""
                response.render('403');
                return;
            };

            // 1 - Récupérer les données
            // console.log(request.body);
            const nameTag = request.body.name;

            // vérifier la taille de la chaine de caractère saisie dans les champs du formulaire par l'user
            if (!nameTag) { // Si =0, on rajoute une erreur à notre tableau
                return response.render('admin/addtag', {
                    error: "Veuillez ajouter un thème",
                    errorField: "name"
                });
            };

            // Vérifier l'existance d'un tag avec le nom du tag
            const foundTag = await Tag.findOne({
                where: {
                    name: nameTag
                }
            });
            if (foundTag) {
                return response.render('admin/addtag', {
                    error: "Ce thème existe dans la base de donnée, veuillez recommencer",
                    errorField: "name"
                });
            };
            
            // 7 - Création du thème
            const newtag = await Tag.create({
                name: nameTag
            });


            // 9 - Rediriger l'user sur sa page, ici page succès
            response.render('admin/addtag', {
                nameTag,
                message: "Thème ajouté avec succés"
            });

        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },


    adminUdaptePage: async (request, response) => {

        try {
            const tags = await Tag.findAll();
            response.render('admin/updatetag', {
                tags
            });
            
        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },

    adminUdapteTag: async (request, response) => {
        try {
            // Si l'user n'a pas propriété user dans sa session ou s'il n'est pas connecté
            // alors on le renvoie sur la page login avec un message erreur
            if (!request.session.user) {
                // Je stocke en session la page vers laquelle il faudra rediriger l'user une fois qu'il sera loggué 
                request.session.redirectAfterLogin = request.path;

                // au lieu de renvoyer le HTML du quiz, on lui envoie le HTML de la vue "login"
                return response.render('login', {
                    error: 'Veuillez vous connecter pour accéder à la base !'
                });
            };

            // Si l'user connecté n'a pas le role admin
            if (request.session.user.role !== 'admin') {
                // J'affiche la vue "INTERDIT !"""
                response.render('403');
                return;
            };

            // 1 - Récupérer les données
            // console.log(request.body);
            const oldname = request.body.oldname;
            const newname = request.body.newname;

            // vérifier la taille de la chaine de caractère saisie dans les champs du formulaire par l'user
            if (!newname) { // Si =0, on rajoute une erreur à notre tableau
                return response.render('/admin/updatetag', {
                    error: "Veuillez ajouter un thème",
                    errorField: "newname"
                });
            };

            // Vérifier l'existance d'un tag avec le nom du tag
            const foundTag = await Tag.findOne({
                where: {
                    name: newname
                }
            });
            if (foundTag) {
                return response.render('/admin/updatetag', {
                    error: "Ce thème existe dans la base de donnée, veuillez recommencer",
                    errorField: "newname"
                });
            };

            // 7 - Modification du thème
            await Tag.update({
                name: oldname
            }, {
                where: {
                    name: newname
                }
            });

            console.log('ANCIEN NOM', oldname);
            console.log('NOUVEAU NOM', newname);
            const tags = await Tag.findAll();
            // 9 - Rediriger l'user sur sa page, ici page succès
            response.render('admin/updatetag', {
                tags,
                message: "Thème modifié avec succés"
            });


        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },

    adminDeletePage: async (request, response) => {

        try {
            const tagList = await Tag.findAll();
            response.render('admin/deletetag', {
                tagList
            });
            
        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },

    adminDeleteTag: async (request, response) => {
        try {
            // Si l'user n'a pas propriété user dans sa session ou s'il n'est pas connecté
            // alors on le renvoie sur la page login avec un message erreur
            if (!request.session.user) {
                // Je stocke en session la page vers laquelle il faudra rediriger l'user une fois qu'il sera loggué 
                request.session.redirectAfterLogin = request.path;

                // au lieu de renvoyer le HTML du quiz, on lui envoie le HTML de la vue "login"
                return response.render('login', {
                    error: 'Veuillez vous connecter pour accéder à la base !'
                });
            };

            // Si l'user connecté n'a pas le role admin
            if (request.session.user.role !== 'admin') {
                // J'affiche la vue "INTERDIT !"""
                response.render('403');
                return;
            };

            // 1 - Récupérer les données
            // console.log(request.body);
            const nameTag = request.body.name;


            // 7 - Modification du thème
            const delTag = await Tag.destroy({
                where: {
                    name: nameTag
                }
            });

            const tagList = await Tag.findAll();

            response.render('admin/deletetag', {
                tagList,
                message: "Thème supprimé avec succés"
            });


        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },

    adminLinkPage: async (request, response) => {
        try {
            const tag = await Tag.findAll({
                include: [{
                    association: 'quizzes',
                    include: ['author']
                }]
            });
            const quizList = await Quiz.findAll({
                // On demande à sequelise de créer une propriété "author" à tous nos quiz qui contiendra l'auteur de chaque quiz.
                include: ['author']
            });

            console.log('XOXOOOO', quizList);
            // La transmettre à la vue
            response.render('admin/linktag', {
                quizList,
                nameTag: tag
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
  
module.exports = adminController;