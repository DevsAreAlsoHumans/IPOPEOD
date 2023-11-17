function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.status(401).send("Accès non autorisé");
    }
}
function hasPermission(requiredRole) {
    return function(req, res, next) {
        if (req.session && req.session.user && req.session.user.role === requiredRole) {
            return next();
        } else {
            res.status(403).send("Accès refusé");
        }
    };
}