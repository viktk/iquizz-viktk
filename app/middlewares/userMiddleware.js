// un petit middleware pour tester si un utilisateur est connecté
// si c'est le cas, on le rajoute dans request.locals
// ainsi, on pourra utiliser la variable "user" dans toutes les views sans se poser de question

const userMiddleware = (request, response, next) => {
    if(request.session.user) {
        response.locals.user = request.session.user;
    } else {
        response.locals.user = false;
    }
    response.locals.formData = {};
    next();
};
  
module.exports = userMiddleware;