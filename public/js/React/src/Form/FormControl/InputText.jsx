import React from "react";
import SearchFormSparePartsResponse from "./SearchFormSparePartsResponse.jsx";

export default class InputText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isValid: false,
            value: this.props.value
        }
    }

    validateOnBlur = (event) => {

        if (event.target.value.length < 5) {
            this.setState({
                error: 'Поле не может быть менее 5 символов!',
            });
            this.props.handleBlur({
                isValid: false
            });
        } else {
            this.setState({
                error: '',
            });

            this.props.handleBlur({
                isValid: true
            });
        }
        this.props.handleBlur({
            spare_parts: event.target.value,
        })
    }


    render() {
        let success_or_error;
        if (this.state.isValid){
            success_or_error =
                <div className={"success"} >

            </div>
        }
        return (
            <>
                <input
                    type="text"
                    name={this.props.name}
                    value={this.state.value}
                    id={this.props.id}
                    placeholder={this.props.placeholder}
                    onBlur={this.validateOnBlur}
                />
                {success_or_error}
                <div className={'error'}>
                    {this.state.error}
                </div>
            </>
        )
    }
}