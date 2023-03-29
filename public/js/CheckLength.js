import Validator from "./validator";

export default class CheckLength extends Validator {
    constructor(params) {
        super();
        let default_params = {
            'min_length': 'number',
            'max_length': 'number'
        }
        this.checkParams(default_params, params);
        this.params = params;
        // this.checkLength();
    }

    checkLength(field) {



        if (field.value.length < this.params['min_length']) {

            let error_message = 'Поле не может быть менее ' + this.params['min_length'] + ' символов!';
            throw new Error(error_message);
        }
        if (field.value.length > this.params['max_length']) {

            let error_message = 'Поле не может быть более ' + this.params['max_length'] + ' символов!'
            throw new Error(error_message);
        }

        return true;


// return true or throw err
    }
}