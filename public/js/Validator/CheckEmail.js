import BaseValidator from "./BaseValidator";

export default class CheckEmail extends BaseValidator {
    constructor(field) {
        super();
        this.field = field;
    }

    checkEmail() {
        const emailRegex = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;

        if (this.field.match(emailRegex)) {
            return true
        } else {
            throw 'Не верный формат E-mail!'
        }
    }
}