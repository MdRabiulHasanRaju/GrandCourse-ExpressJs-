module.exports = () => {
  return (req, res, next) => {
    res.locals.user = req.user;
    res.locals.LoggedIn = req.session.LoggedIn;
    next();
  };
};
