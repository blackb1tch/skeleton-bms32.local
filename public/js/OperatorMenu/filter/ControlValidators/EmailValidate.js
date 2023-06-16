import BaseValidator from "../../../Validators/BaseValidator";
import CheckEmail from "../../../Validators/CheckEmail";

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