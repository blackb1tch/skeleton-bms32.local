import React from "react"
import ControlInputBase from "./ControlInputBase.jsx";
import IdValidate from "../../../../OperatorMenu/filter/ControlValidators/IdValidate";
import NameValidate from "../../../../OperatorMenu/filter/ControlValidators/NameValidate";
export default class ControlInputSpareParts extends ControlInputBase {
    validateList = {
        IdValidate: new IdValidate(),
        NameValidate: new NameValidate(),
    }
    constructor(props) {
        super(props);
    }
    validateResponse(value){
        if (value===true){
           console.log( 'form valid');
        } else {
            console.log( 'form INvalid');
            console.log( value);

        }
    }

    render() {
        return (

        <ControlInputBase
            name={"spare_parts"}
            id={"spare_part"}
            className={"form-control"}
            size={"130"}
            placeholder={"Введите наименование запчасти"}

            validateList={this.validateList}
            validateResponse={(value) => this.validateResponse(value)}
            handleBlur={(value) => this.inputSetState(value)}
            onChange={this.setIsValid}
        />
        );
    }
}