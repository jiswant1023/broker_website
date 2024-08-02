const User = require("../models/user.model");
const { errorHandler } = require("../utils/error");

 const home=(req,res)=>{
    res.status(200).json({
        message:"jiswzdfvdantclass"
    });
}

const deleteUser= async (req,res,next) => {
    
    if(req.user.id !== req.params.id) return next(errorHandler(401,'only delete own user id'));

    try {
        await User.findByIdAndDelete(req.params.id);
        
            res.clearCookie('access_token');
       
        res.status(200).json({
            message:"User has been deleted",
        });
        
    } catch (error) {
        next(error);
    }
}
module.exports={home,deleteUser};