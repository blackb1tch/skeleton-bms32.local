import React from "react";
export default function SearchFormSparePartsResponse (props) {
    return (
        <>
            <span>Поиск выполнен успешно, "{props.spare}" в наличии на складе, в размере {props.quantity} шт.</span>
        </>
    );
}