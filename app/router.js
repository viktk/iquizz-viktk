const express = require('express');

// importer les controllers
const mainController = require('./controllers/mainController');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const quizController = require('./controllers/quizController');
const tagController = require('./controllers/tagController');

// importer les middlewares
const adminMiddleware = require('./middlewares/adminMiddleware');

const router = express.Router();

// route page d'accueil
router.get('/', mainController.getHomePage);

// route page des quizz
router.get('/quiz/:id', quizController.getOneQuiz);
router.post('/quiz/:id', quizController.playQuiz);

// page "tags" ("sujets")
router.get('/tags', tagController.tagList);

// quizzes par tag
router.get('/quizzes/tag/:id', quizController.listByTag);

// route page d'inscription
router.get('/signup', userController.signupPage);
router.post('/signup', userController.signupAction);

// route page de connexion
router.get('/login', userController.loginPage);
router.post('/login', userController.loginAction);

// route page de déconnexion
router.get('/logout', userController.logoutAction);

// route page profil utilisateur
router.get('/profile', userController.profilePage);

// route page administrateur
router.get('/admin', adminMiddleware, adminController.adminPage);

// route page administrateur : ajout d'un theme
router.get('/admin/addtag', adminMiddleware, adminController.adminAddPage);
router.post('/admin/addtag', adminMiddleware, adminController.adminAddTag);

// route page administrateur : modification d'un theme
router.get('/admin/updatetag', adminMiddleware, adminController.adminUdaptePage);
router.post('/admin/updatetag', adminMiddleware, adminController.adminUdapteTag);

// route page administrateur : suppression d'un theme
router.get('/admin/deletetag', adminMiddleware, adminController.adminDeletePage);
router.post('/admin/deletetag', adminMiddleware, adminController.adminDeleteTag);

// route page administrateur : suppression d'un theme
router.get('/admin/linktag', adminMiddleware, adminController.adminLinkPage);
// router.post('/admin/linktag', adminMiddleware, adminController.adminLinkTag);


// Le dernier middleware de notre router est obligé de récupérer les requêtes qui ne se sont pas arrêtés avant.
// Cela voudra dire une page introuvable
router.use(mainController.pageNotFound);

//! Ici on ne peut plus mettre de route, jamais cela ne dépassera notre middleware 404

module.exports = router;