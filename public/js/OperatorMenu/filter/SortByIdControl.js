import BaseControl from "./BaseControl";
import BaseForm from "../../BaseForm";

export default class SortByIdControl extends BaseControl {
    field = document.querySelector('#sort-by-id').querySelector('input[type=radio]:checked');
    BaseForm = new BaseForm();

    constructor() {
        super();
    }

    Validate() {
        return true;
        this.removeErrors();


        if (this.field.value === 'asc' || this.field.value === 'desc' || this.field.value === 'ASC' || this.field.value === 'DESC') {
            return true;
        }
        this.generateError();
        // switch (this.field.value) {
        //     case ('asc'):
        //         return true;
        //     case ('desc'):
        //         return true;
        //     case ('ASC'):
        //         return true;
        //     case ('DESC'):
        //         return true;
        //     default:
        //         this.generateError();
        // }
    }

    generateError() {
        return this.BaseForm.generateError('Сортировка (' + this.field.value + ') указана не верно!', '#' + this.field.id);
    }

    getValue() {
        return {
            'field': this.field.value
        };
    }

    getRoute() {
        return '/sort-by/id/asc-or-desc/' + this.field.value
    }

}