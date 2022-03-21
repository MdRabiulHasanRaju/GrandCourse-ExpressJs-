const Flash = require("../utils/Flash")
exports.errorPageNotFoundGetController = (req, res, nex)=>{
    res.render("pages/error/404",{
        title:"404 Page Not Found!",
        flashMessage: Flash.getMessage(req)
    })
}

exports.errorInternalServerGetController = (req, res, nex)=>{
    res.render("pages/error/500",{
        title:"500 Internal Server Error!",
        flashMessage: Flash.getMessage(req)
    })
}
