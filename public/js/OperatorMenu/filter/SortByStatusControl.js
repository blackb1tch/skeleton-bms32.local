import BaseControl from "./BaseControl";
import BaseForm from "../../Form/BaseForm";

export default class SortByStatusControl extends BaseControl {
    field = document.querySelector('#sort-by-status').querySelector('input[type=radio]:checked');
    BaseForm = new BaseForm();

    constructor() {
        super();

    }

    Validate() {
        this.removeErrors();
        if (this.field.value === 'null' || this.field.value === '0' || this.field.value === '1') {
            return true;
        }
        this.generateError();
    }
    removeErrors() {
        this.BaseForm.removeErrors('#' + this.field.id + '_error');
    }

    generateError() {
        return this.BaseForm.generateError('Статус (' + this.field.value + ') указан не верно!', '#' + this.field.id);
    }

    getValue() {
        return {
            'field': this.field.value
        };
    }

    getRoute(){
        return '/is-approved/' + this.field.value;
    }
}