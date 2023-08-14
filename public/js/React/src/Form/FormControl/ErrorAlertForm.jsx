import React from "react";

export default function ErrorAlert (props) {
    return (
        <>
            <h1>Ошибка!</h1>
            <div className="alert alert-danger">
                {props.message}
            </div>
        </>
    );
}