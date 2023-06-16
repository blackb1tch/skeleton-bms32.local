import BookingMessageValidate from "./BookingMessageValidate";
import EmailValidate from "./EmailValidate";
import IdValidate from "./IdValidate";
import NameValidate from "./NameValidate";
import PhoneValidate from "./PhoneValidate";

export default class SearchControlValidatorsList {
    getList() {
        return {
            'BookingMessageValidate': new BookingMessageValidate(),
            'EmailValidate': new EmailValidate(),
            'IdValidate': new IdValidate(),
            'NameValidate': new NameValidate(),
            'PhoneValidate': new PhoneValidate()
        }
    }
}