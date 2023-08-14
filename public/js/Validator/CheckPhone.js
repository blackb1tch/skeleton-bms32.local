import BaseValidator from "./BaseValidator";

export default class CheckPhone extends BaseValidator {
    field;
    constructor(field) {
        super();
        this.field = field;
    }

    setField(field){
        this.field = field;
    }
    checkPhone(format) {

        if (format === 'rus'){
            let regexp =/^[\d\+][\d\(\)\ -]{4,14}\d$/;

            if  (!(this.field.match(regexp))){
                console.log('phoneErr');
                let error_message = 'Телефон должен соответствовать шаблону  +7(999)123-45-67!';
                throw error_message;
            }
            else return true;
        }
    }
}