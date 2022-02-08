import React from 'react'


function useDebounce(value,delay){
    const [debounceValue,setDebounceValue] = React.useState(value)

    React.useEffect(()=>{
        const handler = setTimeout(()=>{
            setDebounceValue(value)
        },delay)

        return ()=>{
            clearInterval(handler)
        }

    },[value])
    return debounceValue
}



export default useDebounce