// un petit middleware pour tester si un utilisateur est connecté en administrateur
// si c'est le cas, on le rajoute dans request.locals
// ainsi, on pourra utiliser la variable "user" dans toutes les views ADMIN sans se poser de question

const adminMiddleware = (request, response, next) => {
    // Si on n'est pas connecté, renvoi page login
    if(!request.session.user){
        return response.redirect('/login');
    }

    // Si on est connecté mais sans le role admin
    if(request.session.user && request.session.user.role !== 'admin') {
        next();
    } else {
        return response.status(404).render('404');
    }
};
  
module.exports = adminMiddleware;