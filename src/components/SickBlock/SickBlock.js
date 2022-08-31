import FormAddSick from "../Forms/FormAddSick/FormAddSick";
import React from "react";


const SickBlock=({currentId})=>{
    return (
        <>
            <div>Болезнь</div>
            <FormAddSick
                currentId={currentId}
            />
        </>
    )
}

export {
    SickBlock
}