/**
@DEPRECATED
 */

export default class FormValidate  {
    field;
    valid;

    constructor(field) {
        this.field = field;
        this.valid = true;

    }



    isValid() {
        return this.valid;
    }

    // checkLength(min_length, max_length) {
    //     if (typeof (min_length) === 'number' && typeof (max_length) === 'number') {
    //
    //         if (this.field.value.length < min_length) {
    //
    //             let error_message = 'Поле не может быть менее ' + min_length + ' символов!';
    //             this.generateError(error_message, this.field);
    //
    //             return this.valid = false;
    //         }
    //         if (this.field.value.length > max_length) {
    //
    //             let error_message = 'Поле не может быть более ' + max_length + ' символов!';
    //             this.generateError(error_message, this.field);
    //
    //             return this.valid = false;
    //         }
    //
    //         return this.valid = true;
    //     } else {
    //         throw new Error('Параметр должен быть типа "number"!')
    //     }
    // }

    checkEmail() {
console.log('checkEMAIl');
    }

    checkPhone(format) {

        if (format === 'rus'){
            // let regexp ='[\+7,8]\(\d{3}\)\d{3}-\d{2}-\d{2}';
            let regexp ='[+7,8]\d{10}';

            if  (!regexp.match(this.field.value)){
                let error_message = 'Телефон должен соответствовать шаблону  +7(999)999-99-99 или 8(999)999-99-99!';
                this.generateError(error_message, this.field);
            }
            else return true;
        }

    }
}
