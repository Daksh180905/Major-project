const express= require("express");
const router= express.Router();
const Listing= require ("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js")
const {validateListing}=  require("../middleware.js");
const {isLoggedIn}=  require("../middleware.js");
const {isOwner}=  require("../middleware.js");
const listingController = require ("../controllers/listings.js");
const multer  = require('multer')
const {storage}= require("../cloudConfig.js")
const upload = multer({ storage })


router.route("/")
.get(wrapAsync(listingController.index)) 
.post(isLoggedIn,upload.single('listing[image]'),validateListing ,wrapAsync(listingController.createListing )) 



//new route ----create new listing 
router.get("/new",isLoggedIn,listingController.renderNewForm)


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))



//edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports=router;



