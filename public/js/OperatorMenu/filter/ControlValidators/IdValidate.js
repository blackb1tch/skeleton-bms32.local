import BaseValidator from "../../../Validators/BaseValidator";

export default class IdValidate extends BaseValidator {
    constructor() {
        super();
    }

    Validate(field_value) {

        let regexp = /\d/;

        if (field_value.match(regexp)) {
            return true;
        } else {
            throw 'Id введен не верно!';
        }
    }
}