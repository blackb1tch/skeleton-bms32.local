import BaseValidator from "../../../Validator/BaseValidator";
import CheckLength from "../../../Validator/CheckLength";

export default class NameValidate extends BaseValidator {
    CheckLength;
    constructor() {
        super();

        let params = {
            'min_length': 2,
            'max_length': 100
        }
        this.CheckLength = new CheckLength(params);
    }

    Validate(field_value) {
        try {
            let field_obj = {
                value: field_value
            };
            return this.CheckLength.checkLength(field_obj);
        } catch (Error) {
            throw Error;
        }
    }
}
