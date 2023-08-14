import BaseValidator from "../../../Validator/BaseValidator";
import CheckPhone from "../../../Validator/CheckPhone";

export default class PhoneValidate extends BaseValidator {
    format = 'rus';

    constructor() {
        super();
    }

    Validate(field_value) {
        try {
            let checkPhone = new CheckPhone(field_value);
            return checkPhone.checkPhone(this.format);
        } catch (Error) {
            throw Error;
        }
    }
}