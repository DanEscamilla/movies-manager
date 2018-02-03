
module.exports = {

  createMiddleware:(fn,req,res,context,next)=>{
    return ()=>{
      fn(req,res,context,next);
    }
  },
  createNestedRoute:(parentParamName,nestedEndpoint)=>{
    // console.log("/:"+parentParamName+nestedEndpoint);
    return "/:"+parentParamName+nestedEndpoint;
  }
}
