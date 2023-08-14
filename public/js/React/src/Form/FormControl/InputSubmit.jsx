import React from "react";

export default class InputSubmit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <input
                    type="submit"
                    name="submit"
                    className={this.props.className}
                    value={this.props.value}
                />
            </>
        )
    }
}