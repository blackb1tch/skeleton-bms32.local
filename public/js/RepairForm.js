import TimeSlots from "./TimeSlots";
import baseForm from "./BaseForm";
import CheckLength from "./Validators/CheckLength";

class RepairForm extends baseForm {
    constructor() {
        super();
        let elementForm = document.querySelector('#repair-form');
        let self = this;

        elementForm.addEventListener('submit', function (e) {
            e.preventDefault();
            //validation

            let input_repair_form = document.querySelector('#repair');


            let params = {
                'min_length': 2,
                'max_length': 75
            };

            try {
                let checkLength = new CheckLength(params);
                checkLength.checkLength(input_repair_form);

                // удалить прошлый ответ формы
                self.removeErrors('#repair_error');
                self.removeErrors('.repair_response');

                self.removeErrors('.time-slots-control');
                self.removeErrors('.booking-success');
                self.removeErrors('#booking-error');

                self.RepairMessage();

                let timeSlots = new TimeSlots();
                timeSlots.render();

            } catch (error) {
                self.generateError(error, '#repair');

            }
        });
    }

    RepairMessage() {

        let repair_response = document.createElement('div');
        repair_response.className = 'repair_response';
        let repair_input = document.getElementById('repair').value;

        repair_response.innerHTML = '<span> Для ремонта "' + repair_input + '", необходимо записаться, доступное время записи:</span>';
        document.querySelector('#repair-form').after(repair_response);


    }
}

new RepairForm();

