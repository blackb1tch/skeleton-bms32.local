import React from "react";
import InputText from "./InputText.jsx";
import InputSubmit from "./InputSubmit.jsx";
import EditForm from "./EditForm.jsx";

export default class MainForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field1: 'field1',
            field2: 'field2',
            showEdit: false
        }
    }

    inputEditForm = (state) => {
        this.setState({
            field1: state.field1,
            field2: state.field2,
        })
    }
    addEdit = () => {
        return (<EditForm
            field1={this.state.field1}
            field2={this.state.field2}
            onSubmit={this.inputEditForm}
        />)
    }
    showEdit = () => {
        console.log('this.state.showEdit1:', this.state.showEdit);

        this.setState({
            showEdit: true
        });
        console.log('this.state.showEdit2:', this.state.showEdit);

    }
    hideEdit = () => {
        this.setState({
            showEdit: false
        });
    }


    render() {
        let editForm = '';
        if (this.state.showEdit) {
            editForm = <EditForm
                field1={this.state.field1}
                field2={this.state.field2}
                onSubmit={this.inputEditForm}
            />
        }
        return (
            <div>
                <div>{this.state.field1}</div>
                <div >{this.state.field2}</div>
                <InputSubmit
                    className="btn"
                    value="edit"
                    onDanya={this.showEdit}
                />
                {editForm}
            </div>);
    }
}