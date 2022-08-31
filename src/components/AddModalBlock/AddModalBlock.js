import FormVaccine from "../Forms/FormAddVaccine/FormVaccine";
import React from "react";


const AddModalBlock=({currentId})=>{
    return <FormVaccine
        currentId={currentId}
    />
}

export {
    AddModalBlock
}