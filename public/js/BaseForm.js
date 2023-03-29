export default class BaseForm {

    constructor() {
    }

    generateError(error_message = '', field_id = '') {
        let field = document.querySelector(field_id);

        // очистка старых ошибок
        this.removeErrors('.' + field.id + '_error');

        let error = document.createElement('div');
        error.className = field.id + '_error';
        // error.className = field_id;
        error.style.color = 'red';
        error.innerHTML = '<span>' + error_message + '</span>';
        field.after(error);
    }

    clearForm(form_selector) {

        document.querySelector(form_selector).reset();
    }

    hideForm(form_selector) {
        document.querySelector(form_selector).style.display = 'none';
    }


    removeErrors(error_class ) {

        let errors = document.querySelectorAll(error_class);

        for (let i = 0; i < errors.length; i++) {
            errors[i].remove()
        }
    }

}