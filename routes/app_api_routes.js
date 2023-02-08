



const router =  require("express").Router();


const user_reg_controller =require("../controllers/user_reg");
const user_login_controller= require("../controllers/user_login");
const user_prof_controller=require("../controllers/user_profile");
const all_user_controller = require("../controllers/all_user");
const user_update_controller=require("../controllers/user_update");
const user_delete_controller=require("../controllers/user_delete");
const admin_update_controller=require("../controllers/admin_update");







router.post("/reg",user_reg_controller.user_reg);
router.post("/login",user_login_controller.user_login);
router.get("/user_prof",user_prof_controller.user_prof);
router.get("/get_all_user",all_user_controller.all_user);
router.post("/update_prof",user_update_controller.user_update);
router.delete("/delete_user/:user_id",user_delete_controller.user_delete);
router.post("/update_user_profile/:user_id",admin_update_controller.admin_update);


module.exports = router;
