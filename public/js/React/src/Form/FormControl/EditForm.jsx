import React from "react";
import InputText from "./InputText.jsx";
import InputSubmit from "./InputSubmit.jsx";

export default class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field1: this.props.field1,
            field2: this.props.field2,
            isValid:false
        }
    }

    inputSave = () => {
        console.log('EditForm.isValid:',this.state['isValid'])
       if (this.state.isValid){
           this.props.onSubmit(this.state);
       }

    }
    setIsValid = (value) => {
        this.setState({isValid: value});
    }
    setEditedValue= (value) => {
        this.setState(value);
    }

    render() {
        return (
            <div>
                <InputText
                    name="name"
                    value={this.props.field1}
                    disabled="true"
                    id="1"
                    onInput={this.setIsValid}
                    editedValue = {(value) => this.setEditedValue({field1:value})}

                />
                <InputText
                    name="age"
                    value={this.props.field2}
                    disabled="true"
                    id="2"
                    onInput={(isValid) =>this.setIsValid({isValid: isValid})}
                    editedValue = {(value) => this.setEditedValue({field2:value})}
                />
                <InputSubmit
                    className="btn"
                    value="save"
                    onDanya={this.inputSave}
                />
            </div>);
    }
}