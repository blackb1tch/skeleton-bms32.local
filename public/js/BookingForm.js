import CheckLength from "./CheckLength";
import XHR from "./xhr";
import DateConvert from "./date-convert";
import baseForm from "./BaseForm";

export default class BookingForm extends baseForm {
    form_selector = '#booking-form';
    input_validation_rules =
        {
            'input_name': {
                'checkLength': new CheckLength({
                    'min_length': 2,
                    'max_length': 100
                })
            },
            'input_email': {
                'checkLength': new CheckLength({
                    'min_length': 2,
                    'max_length': 100
                })
            },
            'input_phone': {
                'checkLength': new CheckLength({
                    'min_length': 10,
                    'max_length': 20
                })
            },
            'input_booking-msg': {
                'checkLength': new CheckLength({
                    'min_length': 2,
                    'max_length': 4096
                })
            }
        };

    constructor(date) {
        super();

        this.date = date;
        this.DateConvert = new DateConvert();

        this.setTimeSlotDataToForm(date);

        let self = this;
        let bookingForm = document.querySelector('.booking-form');
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation()
            self.submit();
        });

    }


    setTimeSlotDataToForm(date) {
        let disabled_booking_time_input = document.querySelector('.disabled_booking_time')
        disabled_booking_time_input.value = this.DateConvert.convertDateTime(date);

        let hidden_booking_time_input = document.querySelector('.hidden_booking_time');
        hidden_booking_time_input.value = date;

        let repair_input = document.querySelector('#repair');
        let input_booking_msg = document.querySelector('#input_booking-msg');
        input_booking_msg.placeholder = repair_input.value + ', добавьте описание необходимого ремонта';// @TODO: заменить на placeholder

    }


    renderUserError(message) {
        // удалить существующий блок с ошибкой
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

        let booking_form = document.querySelector('.booking-form');
        booking_form.append(error_form);
        error_form.append(h2);
        error_form_message.append(span);
        error_form.append(error_form_message);
    }

    /**
     *
     * @returns {*}
     */
    isValid() {
        let valid = true;
        for (let input_name in this.input_validation_rules) {

            if (this.fieldValidate(input_name) !== true){
                valid = false;
            }
        }
        return valid;
    }

    fieldValidate(input_name) {
        let field = document.querySelector('#' + input_name);

        let input = this.input_validation_rules[input_name];
        for (let validator in input) {
            this.removeErrors( '.'+ field.id +  '_error');
            //  перебор указанных валидаторов поля
            try {
                if(input[validator].checkLength(field)){
                    return true;
                }


            } catch (error) {
                // обработка ошибки

                this.generateError(error, '#' + field.id);

            }
        }
    }


    makeJSON() {
        return JSON.stringify({

            "hidden_booking_time": document.querySelector('.hidden_booking_time').value,
            "disabled_booking_time": document.querySelector('.disabled_booking_time').value,
            "name": document.querySelector('#input_name').value,
            "email": document.querySelector('#input_email').value,
            "phone": document.querySelector('#input_phone').value,
            "booking-msg": document.querySelector('#input_booking-msg').value
        });
    }

    submit() {
        if (this.isValid()) {
            // отправить на сервер

            let newXHR = new XHR('POST', this.makeJSON(), '/api/booking');
            let json_promise = newXHR.getXhr();

            let self = this;
            json_promise.then(function (result) {
                console.log('отправка на сервер');

                let json_response = (JSON.parse(result));
                let status = json_response['status'];
                if (status === 'OK') {
                    console.log('записалось в базу');
                    // заявка принята

                    //удаление ошибок
                    self.removeErrors('.booking-error');
                    self.removeErrors('.repair_response');
                    // очистка форм
                    // очистка bookingForm
                    self.clearForm(self.form_selector);
                    // маскировка bookingForm
                    self.hideForm('.booking-form');

                    // маскировка TimeSlots
                    self.hideForm('.time-slots-control');

                    // очистка repairForm
                    self.clearForm('#repair-form');
                    self.renderSuccessMessage(document.querySelector('.hidden_booking_time').value);
                }
                if (status === 'error' || status === 'exception') {
                    // вывод ошибки
                    self.renderUserError(json_response['message']);
                    document.querySelector('.booking-error').scrollIntoView({
                        behavior: "smooth",
                        block: "end"
                    });
                }
            });
            json_promise.catch(function (reject) {
                // ошибка транспорта
                self.renderUserError(reject);
                document.querySelector('.booking-error').scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                });
            });

        }
    }


    renderSuccessMessage(time) {
        // удалить существующий блок
        this.removeErrors('.booking-success');
        // this.FormValidate.removeElementsInBlock('.booking-success');

        let success_form = document.createElement('div');
        let success_form_message = document.createElement('div');
        let h2 = document.createElement('h2');
        let span = document.createElement('span');
        success_form.className = 'booking-success';
        h2.innerHTML = 'Спасибо!';
        span.innerHTML = 'Заявка на ' + this.DateConvert.convertDateTime(time) + ' принята. С вами свяжутся в ближайшее время для уточнения деталей.';
        success_form_message.className = "alert alert-success";
        success_form_message.role = "alert";

        let repair_form = document.querySelector('.repair-form');
        repair_form.append(success_form);
        success_form.append(h2);
        success_form_message.append(span);
        success_form.append(success_form_message);
    }
}