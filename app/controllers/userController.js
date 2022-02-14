
const { User } = require('../models/');
const emailValidator = require('email-validator'); // Module permattant la vérification syntaxique d'un email
const bcrypt = require('bcrypt'); // Module permattant de hasher un password

const userController = {

    signupPage: (request, response) => {
        response.render('signup');
    },


    signupAction: async (request, response) => {
        try {
            // 1 - Récupérer les données
            // console.log(request.body);
            response.locals.formData = request.body;


            const firstname = request.body.firstname;
            const lastname = request.body.lastname;
            const emailUser = request.body.email;
            const password = request.body.password;
            const passwordConfirm = request.body.passwordConfirm;

            const errors = [];
            //console.log(firstname.length);

            // 2 - Vérifier la cohérences des données
            // vérifier la taille de la chaine de caractère saisie dans les champs du formulaire par l'user
            if (lastname.length === 0) { // Si =0, on rajoute une erreur à notre tableau
                errors.push("Le nom est obligatoire");
            };
            if (firstname.length === 0) { 
                errors.push(" Le prénom est obligatoire");
            };
            if (emailUser.length === 0) {
                errors.push(" L'email est obligatoire");
            };
            if (password.length < 5) {
                errors.push(" Le mot de passe doit contenir minimum 5 caractères");
            };
            // En cas d'erreurs détectées, on rend la vue signup avec le tableau d'erreur.
            if (errors.length > 0) {
                return response.render('signup', {
                    error: errors
                });
            };

            // 3 - Vérifier le format de l'email si valide
            if(!emailValidator.validate(emailUser)) {
                return response.render('signup', {
                    error: "L'email n'est pas valide",
                    errorField: "email"
                });
            };

            // 4 - Comparer l'info password et passwordConfirm si identique
            if (password !== passwordConfirm) {
                return response.render('signup', {
                    error: "La confirmation du mot de passe ne correspond pas",
                    errorField: "password"
                });
            };

            // 5 - Vérifier l'existance d'un user avec l'email
            const foundUser = await User.findOne({
                where: {
                    email: emailUser
                }
            });
            if (foundUser) {
                return response.render('signup', {
                    error: "Cet email est déjà utilisé par un utilisateur.",
                    errorField: "email"
                });
            }

// >> A ce stade, on à déjà tous testé et vérifié si il y avait des problème ou non

            // 6 - Crypter le password avec bCrypt
            const passwordHashed = await bcrypt.hash(password, 10); // "10" correspond au nombre de hachage
            // le password sera détruit à la fin de la méthode
            
            // 7 - Création de l'utilisateur
            // await peut être utiliser sans que le retour de la promesse ne soit stocké dans une variable,
            // on dit juste d'attendre avant d'effectuer les instructions suivantes
            // await User.create({...}); mais on va pas l'utiliser pour la compréhension
            const user = await User.create({
                firstname,
                lastname,
                email: emailUser,
                password: passwordHashed
            });

            // 8 - Connecter l'user (l'enregistrer en session)
            request.session.user = user;

            // 9 - Rediriger l'user sur sa page, ici page succès
            response.render('signup', {
                message: "Inscription réussi"
            });
        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },


    loginPage: (request, response) => {
        response.render('login');
    },


    loginAction: async (request, response) => {
        try {
            // 1 - Récuperer le login et le password saisis par l'user
            const emailUser = request.body.email;
            const passwordUser = request.body.password;

            // 2 - Vérifier le format de l'email si valide
            if(!emailValidator.validate(emailUser)) {
                return response.render('login', {
                    error: "Email non valide"
                });
            };

            // 3 - Vérifier l'existance de l'user avec l'email fourni
            const user = await User.findOne({
                where: {
                    email: emailUser
                }
            });
            if (!user) { // s'il n'existe pas, on renvoie une erreur sur la page login
                return response.render('login', {
                    error: "Email ou mot de passe incorect"
                });
            };

            // 4 - Vérifier le mot de passe
            const passwordIsValid = await bcrypt.compare(
                passwordUser,
                user.password
            );
            if (!passwordIsValid) { // si c'est différent, on renvoie une erreur sur la page login
                return response.render('login', {
                    error: "Email ou mot de passe incorect"
                });
            };
            if(passwordIsValid) { // si ça match
                // On enregistre l'user en session
                request.session.user = user;

                // Si la session contient une info de redirection après s'etre loggué, on l'utilise.
                // "request.session.redirectAfterLogin" si elle est remplie, 
                // elle contient une adresse vers laquelle rediriger l'user, ici ex: /quiz/1
                if (request.session.redirectAfterLogin) { // on le redirige sur la page enregistrée en session
                    response.redirect(request.session.redirectAfterLogin);
                    request.session.redirectAfterLogin = null;
                }
                else { // sinon on le redirige sur la page d'accueil
                    response.redirect('/')
                }
            };
            //delete user.dataValues.password;

            request.session.user = {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role
            };

            response.redirect('/');
        } catch (error) {
            // catch attrape l'erreur qui a été envoyée
            response.status(500).render('500', {
                // On récupère le message de l'erreur pour le mettre dans la vue
                error: error.message
            });
        }
    },


    logoutAction: (request, response) => { // Plusieurs façon de faire :
        // response.clearCookie("connect.sid"); // efface les cookies
        // delete request.session.user; // efface la propriété user de la session
        request.session.destroy(); // efface complétement la session
        response.render('logout'); // Renvoi vers la page logout
    },


    profilePage: (request, response) => {
        if (!request.session.user) {
          return response.redirect('/login');
        }
    
        response.render('profile', {
          user: req.session.user
        });
    }

};

module.exports = userController;