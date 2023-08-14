import React from 'react';
import InputText from "./FormControl/InputText.jsx";
import InputSubmit from "./FormControl/InputSubmit.jsx";
import SearchForm from "../../../Form/SearchForm.js"
import ControlInputSpareParts from "./FormControl/ControlInputSpareParts.jsx";
import SearchFormSparePartsResponse from "./FormControl/SearchFormSparePartsResponse";

export default class SearchFormSpareParts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spare_parts: '',
            isValid: false,
        };
        this.submitToBack = this.submitToBack.bind(this);
    }

    submitToBack(e) {
        e.preventDefault();
        if (this.state.isValid === true) {
            console.log('IM VALID, submit to back');
        }
    }


    setIsValid = (value) => {
        this.setState({isValid: value});
    }


    inputSetState(value) {
        console.log('InputTextState:', value);
        this.setState(value);
    }

    getQuantity() {

        let searchForm = new SearchForm;
        let map_cookie = searchForm.checkCookie(this.state.spare_parts);
        return map_cookie.get(this.state.spare_parts);
    }

    render() {
        let error_or_search_result;
        if (this.state.isValid){
            error_or_search_result =
                <SearchFormSparePartsResponse
                    spare={this.state.spare_parts}
                    quantity={this.getQuantity()}
                />
            ;
        } else {
            error_or_search_result =
                <ErrorForm />
                ;
        }
        return (
            <>
                <div className="form-group ">
                    <h2>Продаем запчасти</h2>
                    <form method="post" name="search-form" id="search-form" onSubmit={this.submitToBack}>
                        <div>
                            <label htmlFor="spare_part">Поиск запчастей по каталогу:</label>
                            <ControlInputSpareParts name={"spare_parts"}
                                                    id={"spare_part"}
                                                    className={"form-control"}
                                                    size={"130"}
                                                    placeholder={"Введите наименование запчасти"}
                                                    handleBlur={(value) => this.inputSetState(value)}
                                                    onChange={this.setIsValid}
                            />
                            <div className="response">
                                {error_or_search_result}
                            </div>
                            <InputSubmit
                                className={"btn btn-primary"}
                                value={"Поиск"}
                            />
                        </div>

                    </form>
                    <div>
                        <span id="search_response"></span>
                    </div>
                </div>
            </>
        );
    }
}
