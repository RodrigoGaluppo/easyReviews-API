const Router = require("express").Router
const UserController = require("../controllers/User")
const ReviewController = require("../controllers/Review")
const CompanyController = require("../controllers/Company")
const UploadController = require("../controllers/Upload")


const router = new Router();

/* user routes */
router.post("/user",UserController.create)
router.put("/user",UserController.auth,UserController.update)
router.delete("/user",UserController.auth,UserController.delete)
router.post("/login",UserController.login)

/* review routes */
router.post("/review",UserController.auth,ReviewController.create)
router.put("/review",UserController.auth,ReviewController.update)
router.get("/review/:review_id",UserController.auth,ReviewController.get)
router.delete("/review",UserController.auth,ReviewController.delete)

/* company routes */
router.get("/companies",UserController.auth,CompanyController.listByUserId)
router.post("/company",UserController.auth,CompanyController.create)
router.put("/company",UserController.auth,CompanyController.update)
router.delete("/company/:company_id",UserController.auth,CompanyController.delete)

/* upload routes */
router.post("/user/upload",UserController.auth,UploadController.single,UserController.upload)
router.post("/company/upload",UserController.auth,UploadController.single,CompanyController.upload)


/* non required login  routes */
router.get("/reviews:/company_id",CompanyController.list)
router.get("/companies/:page/:name",CompanyController.list)
router.get("/companies/:page/",CompanyController.list)
router.get("/company/:company_id",CompanyController.get)

module.exports = router