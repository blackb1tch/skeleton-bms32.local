export default class DateConvert {
    constructor() {
        this.days_of_week_in_russian = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ];
    }

    convertDate(date) {
        return this.converter(date);
    }

    convertDateTime(date) {
        let date_arr = date.split(' ');
        let time = date_arr[0];
        return time + ', ' + this.converter(date);
    }

    converter(date) {
        let date_arr = date.split(' ');
        date_arr = date_arr[1].split('-');

        let year = Number(date_arr[0]);
        let month = Number(date_arr[1]) - 1;
        let month_user_format = '0' + Number(date_arr[1]);
        let day = Number(date_arr[2]);

        let date_obj = new Date(year, month, day);


        let number_of_week = date_obj.getDay();

        let converted_date = this.days_of_week_in_russian[number_of_week] + ', ' + day + '.' + month_user_format;
        return converted_date;
    }
}