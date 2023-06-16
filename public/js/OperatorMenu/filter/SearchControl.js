import BaseControl from "./BaseControl";
import BaseForm from "../../BaseForm";
import SearchControlValidatorsList from "./ControlValidators/SearchControlValidatorsList";

export default class SearchControl extends BaseControl {
    radio_field = document.querySelector('#search-by-message').querySelector('input[type=radio]:checked');
    text_field = document.querySelector('#search-by-message').querySelector('input[type=text]');
    ValidatorsList = new SearchControlValidatorsList();
    BaseForm = new BaseForm();

    constructor() {
        super();
        this.ValidatorsList = this.ValidatorsList.getList();
    }

    Validate() {
        let self = this;
        let validate = true;
        if (!self.text_field.value.length) {
            self.removeErrors();

            return false;
        }
        this.text_field.oninput = function () {


            for (let validator in self.ValidatorsList) {
                if (validator === self.upName() + 'Validate') {
                    try {
                        self.removeErrors();
                        return self.ValidatorsList[validator].Validate(self.text_field.value)

                    } catch (Error) {
                        validate = false;
                        throw  Error;
                    }
                }
            }
        }();
        return validate;
    }

    getValue() {

        return {
            'radio': this.radio_field.value,
            'field': this.text_field.value
        };
    }

    getRoute(){

        return '/search-by/' + this.radio_field.value + '/search-word/' + this.text_field.value;
    }

    upName() {
        let value = this.radio_field.value;
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    removeErrors() {
        this.BaseForm.removeErrors('#' + this.text_field.id + '_error');
    }

    generateError(Error) {
        this.BaseForm.generateError(Error, '#' + this.text_field.id);
    }

}