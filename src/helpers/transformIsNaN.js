

const transformIsNaN=(number)=>{
    return !isNaN(number) ? number.toFixed(1) : 0
}

export {
    transformIsNaN
}