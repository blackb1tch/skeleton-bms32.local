export default class BaseControl {
    Validate() {

    }

    generateError(error_message = '', field_id = '') {

    }

    generateSuccess() {

    }

    getValue(field) {
        return field.value;
    }
}