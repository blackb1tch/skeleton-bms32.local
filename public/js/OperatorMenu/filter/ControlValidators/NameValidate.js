import BaseValidator from "../../../Validators/BaseValidator";
import CheckLength from "../../../Validators/CheckLength";

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
//@TODO: ошибка - ожидается DOM элемент, отправляется его значение
            return this.CheckLength.checkLength(field_value);
        } catch (Error) {
            throw Error;
        }
    }
}
