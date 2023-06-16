import BaseValidator from "../../../Validators/BaseValidator";

export default class DateValidate extends BaseValidator {
    constructor() {
        super();
    }

    Validate(field_value) {
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (field_value.match(dateRegex)) {
            return true
        } else {
            throw 'Не верный формат даты: ' + field_value + '! Ожидается формат: YYYY-MM-DD';
        }

    }
}