export default class BaseForm {

    constructor() {
    }

    generateError(error_message = '', field_id = '') {
        let field = document.querySelector(field_id);

        // очистка старых ошибок
        this.removeErrors('.' + field.id + '_error');

        let error = document.createElement('div');
        error.className = 'error-msg';
        error.id = field.id + '_error';
        // error.className = field_id;
        // error.style.color = 'red';
        error.innerHTML = '<span>' + error_message + '</span>';
        field.after(error);
    }

    generateBlockError(message, dom_object) {
        this.removeErrors('.booking-error');
        let error_form = document.createElement('div');
        let error_form_message = document.createElement('div');
        let h2 = document.createElement('h2');
        let span = document.createElement('span');
        error_form.className = 'booking-error';
        h2.innerHTML = 'Ошибка!';
        span.innerHTML = message;
        error_form_message.className = "alert alert-danger";
        error_form_message.role = "alert";

        dom_object.append(error_form);
        error_form.append(h2);
        error_form_message.append(span);
        error_form.append(error_form_message);
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