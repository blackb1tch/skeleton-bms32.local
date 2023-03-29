import XHR from "./xhr";
import BookingForm from "./BookingForm";
import DateConvert from "./date-convert";

export default class TimeSlots {
    #json

    constructor() {
        let xhr = new XHR('GET', '', '/api/time-slots');
        this.json_promise = xhr.getXhr();
    }

    render() {
        let parent_this = this;
        this.json_promise.then(function (result) {
            let json = (JSON.parse(result));
            let time_slots = json['time_slots'];

            if (json['status'] === 'OK') {

                parent_this.makeHtml(time_slots);

                // обработка выбранного тайм-слота
                document.querySelector('.time-slots-control').onclick = function (event) {
                    let target = event.target;
                    if (target.tagName === 'BUTTON') {


                        let booking_form = document.querySelector('.booking-form');
                        booking_form.style.display = 'block';
                        booking_form.scrollIntoView({
                            behavior: "smooth",
                            block: "end"
                        });
                        new BookingForm(target.value);

                    }
                }
                parent_this.generateButtons(time_slots);
            }
            document.querySelector('.time-slots-control').scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        });
        this.json_promise.catch(function () {
            return false;
        });
    }

    generateButtons(time_slots) {
        for (let today_or_tomorrow in time_slots) {


            for (let time_slot in time_slots[today_or_tomorrow]) {

                let time_slot_button = document.createElement('button');
                time_slot_button.innerHTML = time_slots[today_or_tomorrow][time_slot]['time'];
                time_slot_button.value = time_slots[today_or_tomorrow][time_slot]['date'];

                if (time_slots[today_or_tomorrow][time_slot]['is_available']) {
                    time_slot_button.className = 'btn btn-success today';

                } else {
                    time_slot_button.className = 'btn btn-danger disabled ' + today_or_tomorrow;
                    time_slot_button.disabled = true;
                }

                document.querySelector('.' + today_or_tomorrow).append(time_slot_button);
            }
        }
    }

    makeHtml(time_slots) {
        let time_slots_parent_div = document.createElement('div');
        let clearfix = document.createElement('div');
        let time_slots_today = document.createElement('div');
        let time_slots_tomorrow = document.createElement('div');
        let today_h2 = document.createElement('h2');
        let tomorrow_h2 = document.createElement('h2');
        time_slots_parent_div.className = 'time-slots-control';
        clearfix.className = 'clearfix';
        time_slots_today.className = 'time-slots today';
        time_slots_tomorrow.className = 'time-slots tomorrow';
        document.querySelector('.repair-form').after(time_slots_parent_div);

        let date_convert = new DateConvert();
        date_convert.convertDate(time_slots['today']['09:00']['date']);

        today_h2.innerHTML = "Доступное время на сегодня (" +  date_convert.convertDate(time_slots['today']['09:00']['date']) + "):";
        time_slots_today.append(today_h2);
        time_slots_parent_div.append(time_slots_today);
        time_slots_parent_div.append(clearfix);

        tomorrow_h2.innerHTML = "Доступное время на завтра (" +  date_convert.convertDate(time_slots['tomorrow']['09:00']['date']) + "):";
        time_slots_tomorrow.prepend(tomorrow_h2);
        time_slots_parent_div.append(time_slots_tomorrow);
    }
}