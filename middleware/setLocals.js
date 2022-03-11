const cheerio = require("cheerio");
const moment = require("moment");
module.exports = () => {
  return (req, res, next) => {
    res.locals.user = req.user || {};
    res.locals.LoggedIn = req.session.LoggedIn || false;
    res.locals.truncate = (html) => {
      let node = cheerio.load(html);
      let text = node.text();
      text = text.replace(/(\r\r|\n\r)/gm, "");

      if (text.length <= 100) return text;
      return text.substring(0, 100) + "....";
    };
    res.locals.moment = (time) => {
      return moment(time).fromNow();
    };
    next();
  };
};
