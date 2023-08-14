import BaseValidator from "../../../Validator/BaseValidator";
import CheckEmail from "../../../Validator/CheckEmail";

export default class EmailValidate extends BaseValidator {
    constructor() {
        super();
    }

    Validate(field_value) {
        try {
            let checkEmail = new CheckEmail(field_value);
            return checkEmail.checkEmail();
        } catch (Error) {
            throw Error;
        }
    }
}