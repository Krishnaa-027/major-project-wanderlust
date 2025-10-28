// function wrapAsync(fn){
//     return function (req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }



// or another method to write above code
module.exports= (fn)=>{
    return (req,res,next) =>{
        fn(req,res,next).catch(next);
    };
};