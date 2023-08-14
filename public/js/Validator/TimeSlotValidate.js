import BaseValidator from "./BaseValidator";
import XHR from "../Utils/xhr";
import BookingForm from "../Form/BookingForm";

export default class TimeSlotValidate extends BaseValidator {
    time_slots;

    constructor(time_slots) {
        super();
        this.time_slots = time_slots;
    }

    checkTimeSlot(user_time_slot) {
        console.log('check:',this.time_slots);

        let error_message = 'Дата некорректна!'
        let count = 0;
        console.log(this.time_slots);
        for (let today_or_tomorrow in this.time_slots) {
            for (let time_slot in this.time_slots[today_or_tomorrow]) {

                //  зеленые тайм-слоты
                if (this.time_slots[today_or_tomorrow][time_slot]['is_available']) {
                    if (this.time_slots[today_or_tomorrow][time_slot]['date'] === user_time_slot) {
                        count = count + 1;
                    }

                    //  красные тайм-слоты
                } else {
                    if (this.time_slots[today_or_tomorrow][time_slot]['date'] === user_time_slot) {
                        throw new Error(error_message);
                    }
                }

            }
        }
        if (count !== 1) {
            throw new Error(error_message);
        }
        return true;
    }
}