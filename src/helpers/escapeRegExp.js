
function escapeRegExp(value){
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export default escapeRegExp