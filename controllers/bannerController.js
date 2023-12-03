const Banner=require('../models/bannerSchema')


const loadBanner =async (req,res)=>{
    try {
        const banner=await Banner.find()



        const itemsperpage = 2;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(banner.length / 2);
        const currentproduct = banner.slice(startindex,endindex);

        res.render('admin/banner',{banner:currentproduct,totalpages,currentpage,})
    } catch (error) {
        
    }

}


//----------------------rendering the create banner page---------------------------
const addNewBanner=async(req,res)=>{
    try {
        res.render('admin/addBanner')
    } catch (error) {
        console.log('Error from the banner ctrl in the funtion addNewBanner',error);
        
    }
}

//-----------------------------------------



const createBanner=async(req,res)=>{
    try {
   
        const title=req.body.title
        const description=req.body.description
        const link =req.body.link
        console.log('this is req.body',title,description,link);
         const allreadyExist= await Banner.findOne({title})
        if(!allreadyExist){

            const banner= new Banner({
                image:`/products/${req.session.images}`,
                title,
                description,    
                date:Date.now(),
                link
            })

          const a=  await banner.save()
          console.log('this is banner',a);
          res.redirect('/banner')

        }
        

    } catch (error) {
        console.log('Error from the banner ctrl in the funtion createBanner',error);
        
    }
}

const editBanner=async(req,res)=>{
    try {
        const id =req.query.id
        const banner= await Banner.findById(id)

        if(banner){
            res.render('admin/editBanner',{banner})
        }
       
        
    } catch (error) {
        console.log('Error from the banner ctrl in the funtion editBanner',error);
        
    }
}

const updateBanner=async(req,res)=>{
    try {



        const {title,discription,link,id}=req.body

        const img = req.file ? req.file.filename : null; 

        if(img){
            const update= await Banner.findByIdAndUpdate(id,{
                title,
                discription,
                link,
                image:`/products/${req.session.images}`
            })
            console.log('tis is updated banner',update);
            res.redirect('/banner')

        }else{
            const update= await Banner.findByIdAndUpdate(id,{
                title,
                discription,
                link,
        })
        res.redirect('/api/admin/banner')
    }
   







    } catch (error) {
        console.log('Error from the banner ctrl in the funtion updateBanner',error);
        
    }
}

 const deleteBanner=async(req,res)=>{
            try {
                
        const id = req.query.id


        const banner= await Banner.findByIdAndDelete(id)

        console.log('this is the baner',banner);
        if(banner){
            res.redirect('/banner')

        }



            } catch (error) {
                console.log('Error from the banner ctrl in the funtion updateBanner',error);
                
            }
      }


module.exports={
    loadBanner,
    addNewBanner,
    createBanner,
    editBanner,
    updateBanner,
    deleteBanner
}