import React, {Component} from "react";

export default class ControlInputBase extends Component {
    errors_list = {};
    validateList = {};

    constructor(props) {
        super(props);
        // this.validatorsList = validatorsList;
        console.log(props);
    }


    validate(event) {
        let validate = true;
        // this.errors_list = {};
        for (let validator in this.props.validateList) {
            try {

                this.ValidatorsList[validator].Validate(event.target.value)

            } catch (Error) {
                this.errors_list[validator] = Error;
                validate = false;
            }
        }
        if (validate){
            // return true;
            this.props.validateResponse(true);
        }
        // return this.errors_list;
        this.props.validateResponse(this.errors_list);

    }

    showError() {

    }

    showSuccess() {

    }

    render() {
        return (
            <>
                <input
                    type="text"
                    onChange={this.validate}
                />
            </>
        );
    }
}