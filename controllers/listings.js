const Listing= require ("../models/listing.js");

module.exports.index = async (req,res) => {
   const allListings = await  Listing.find({});
   res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req,res)=> { 
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req,res)=> {
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate: {path:"author"}}).populate("owner");
    if(!listing) {
         req.flash("error","Listing does not exist!")
         return res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req,res,next)=> {
    // let {title,description,image,price,location,country}=req.body; 
    let url = req.file.path;
    let filename= req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    
    await newListing.save();
     req.flash("success","New listing created!")
     return  res.redirect("/listings");    
    }

    module.exports.renderEditForm= async (req,res)=> {
        let {id}=req.params;
        const listing = await Listing.findById(id); 
        if(!listing) {
            req.flash("error","Listing does not exist!");
            return res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")

        res.render("listings/edit.ejs", { listing,originalImageUrl });
    }

    module.exports.updateListing = async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate( id,  { ...req.body.listing }, { new: true }  );
            if (typeof req.file!=="undefined") {
            listing.image = {
              url: req.file.path,
              filename: req.file.filename
            };
            await listing.save();
          }
          req.flash("success", "Listing updated!");
          res.redirect(`/listings/${id}`);
        };

      
      module.exports.destroyListing =async (req,res) => {
          let {id}= req.params;  
          let deletedListing =  await Listing.findByIdAndDelete(id); 
          // console.log(deletedListing);
          req.flash("success","Listing deleted!")
           return res.redirect("/listings");
      }






      //  module.exports.updateListing = async (req, res) => {
      //   const { id } = req.params;
      //   const listing = await Listing.findById(id);
      //   // Update basic fields
      //   listing.title = req.body.listing.title;
      //   listing.description = req.body.listing.description;
      //   listing.price = req.body.listing.price;
      //   listing.country = req.body.listing.country;
      //   listing.location = req.body.listing.location;
      //   // Update image ONLY if user entered a new one
      //   if (req.body.listing.image?.trim()) {
      //     listing.image = {
      //       url: req.body.listing.image,
      //       filename: "listingimage"
      //     };
      //   }
      //   await listing.save();
      //   req.flash("success", "Listing updated!");
      //   res.redirect(`/listings/${id}`);
      // }
