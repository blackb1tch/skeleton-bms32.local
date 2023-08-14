import BaseControl from "./BaseControl";
import DateValidate from "./ControlValidators/DateValidate";
import BaseForm from "../../Form/BaseForm";

export default class SearchByDateControl extends BaseControl {
    dateValidate = new DateValidate();
    BaseForm = new BaseForm();
    date_from = document.querySelector('#date-search').querySelector('#search-date-from');
    date_to = document.querySelector('#date-search').querySelector('#search-date-to');
    for_error =  document.querySelector('#date-search').querySelector('#search-by-date');
    radio_field = document.querySelector('#date-search').querySelector('input[type=radio]:checked');

    constructor() {
        super();
    }

    Validate() {
        let self = this;
        let validate = true;
        if (!self.date_from.value.length) {
            self.removeErrors();

            return false;
        }
        if (!self.date_to.value.length) {
            self.removeErrors();

            return false;
        }
        this.date_from.oninput = function () {
            try {
                self.removeErrors();
                return self.dateValidate.Validate(self.date_from.value.trim());
            } catch (Error) {
                validate = false;
                throw  Error;
            }
        }();

        this.date_to.oninput = function () {
            try {
                self.removeErrors();

                return self.dateValidate.Validate(self.date_to.value.trim());
            } catch (Error) {
                validate = false;
                throw  Error;
            }
        }();
        return true;
    }

    generateError(Error) {
        this.BaseForm.generateError(Error, '#' + this.for_error.id);
    }

    removeErrors() {
        this.BaseForm.removeErrors('#' + this.for_error.id + '_error');
    }

    getValue(field) {
        return super.getValue(this.field);
    }

    getRoute() {

        return '/date-or-create-date/' + this.radio_field.value +
            '/from/' + this.date_from.value + '/to/' + this.date_to.value;
    }
}