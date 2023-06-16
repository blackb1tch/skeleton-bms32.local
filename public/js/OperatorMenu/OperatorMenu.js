import XHR from '../xhr';
import BaseForm from "../BaseForm";

export default class OperatorMenu extends BaseForm {
    json_promise;
    page = 1;
    limit = 5;
    default_route = '/is-approved/null/sort-by/id/asc-or-desc/desc/page/1/limit/5';
    cache_route;
    is_approved;

    constructor(cache_route) {
        super();
        this.cache_route = cache_route;
        this.getList(this.default_route);
    }

    setRoute(cache_route) {
        this.cache_route = cache_route;
    }

    getList(route) {
        let xhr = new XHR('GET', '', '/api/booking' + route);
        this.json_promise = xhr.getXhr();
        let self = this;
        this.json_promise.then(function (result) {
            let json = (JSON.parse(result));
            if (json['response'] === 'OK') {
                let booking_list = json['page-array']['page'];
                self.is_approved = booking_list['status'];
                self.render(booking_list);
                self.listeners();
            }
            if (json['response'] === 'error' || json['response'] === 'exception') {
                self.generateError(json['message'], 'list');
            }

        });
        this.json_promise.catch(function (reject) {
            self.generateError(reject, 'list');
            return false;
        });
    }

    listeners() {
        this.buttonHandler();
    }

    buttonHandler() {

        let card_list = document.querySelectorAll('.booking-card-control');
        let self = this;
        Array.from(card_list).forEach(function (card) {

            card.querySelector('.card-buttons').onclick = function (event) {
                let target = event.target;

                switch (target.className) {
                    case 'btn btn-outline-danger booking-decline':
                        self.areYouSure(card, target);
                        break;
                    case 'btn btn-outline-success booking-approve':
                        self.areYouSure(card, target);
                        break;
                    case 'btn btn-outline-secondary booking-edit':
                        self.editBooking(card);
                        break;

                }
            }
        });
    }

    areYouSure(card, target) {
        let self = this;
        let li_are_you_sure = card.querySelector('.are-you-sure');
        li_are_you_sure.style.display = 'flex';
        // спрятать кнопки отклонить/подтвердить/редактировать
        card.querySelector('.card-buttons').style.display = 'none';

        let button_are_you_sure = target.cloneNode(true);
        // добавить в начало li.are-you-sure div.value кнопку на которую нажал юзер (отклонить/подтвердить)
        li_are_you_sure.querySelector('.value').prepend(button_are_you_sure);

        li_are_you_sure.onclick = function (event) {
            let target = event.target;

            // нажали кнопку отклонить/подтвердить
            if ((target.className === 'btn btn-outline-danger booking-decline') || (target.className === 'btn btn-outline-success booking-approve')) {
                let xhr = new XHR('PUT', '', target.href);
                let approve = xhr.getXhr();

                approve.then(function (result) {
                    console.log(result);
                    let json = (JSON.parse(result));
                    if (json['response'] === 'success') {

                        self.clearPage();
                        self.getList(self.cache_route);
                    }
                    if (json['response'] === 'error' || json['response'] === 'exception') {
                        self.generateError(json['message'], card.id);
                    }

                });
                approve.catch(function (reject) {
                    self.generateError(reject, card.id);
                    return false;
                });
            }

            // нажали кнопку "отмена"
            if (target.className === 'btn btn-outline-secondary cancel') {
                card.querySelector('.card-buttons').style.display = 'flex';
                button_are_you_sure.style.display = 'none'
                li_are_you_sure.style.display = 'none';

            }
        }
    }

    editBooking(card) {
        let form = card.querySelector('form');
        form.className = 'form-enabled';
        let edit_fields = {
            'card-name': true,
            'card-phone': true,
            'card-email': true,
            'card-message': true,
            'card-time': true,
        };
        for (let li_class in edit_fields) {
            let li = card.querySelector('.' + li_class);
            let div_value = li.querySelector('div.value');
            li.querySelector('input.value').value = div_value.textContent;

        }
        let self = this;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            try {
                let formData = new FormData(form);
                form.className = 'form-disabled';
                self.updateBooking(formData, card.id);
            } catch (error) {
                self.generateError(error, card.id);
            }

        });
    }

    updateBooking(formData, card_id) {
        let xhr = new XHR('PUT', this.makeJSON(formData, card_id), '/api/booking/edit/' + card_id);
        let edit_promise = xhr.getXhr();
        let self = this;
        edit_promise.then(function (result) {

            let json = (JSON.parse(result));
            if (json['response'] === 'success' || json['response'] === 'OK') {

                self.clearPage();
                self.getList(self.cache_route);
            }
            if (json['response'] === 'error' || json['response'] === 'exception') {
                self.generateError(json['message'], card_id);
            }

        });
        edit_promise.catch(function (reject) {
            self.generateError(reject, card_id);
            return false;
        });
    }

    makeJSON(formData, card_id) {
        return JSON.stringify({
            "id": card_id,
            "hidden_booking_time": formData.get('card-time'),
            "disabled_booking_time": "time",
            "name": formData.get('card-name'),
            "email": formData.get('card-email'),
            "phone": formData.get('card-phone'),
            "booking-msg": formData.get('card-message')
        });
    }


    render(booking_list) {
        for (let booking_card in booking_list) {
            booking_card = booking_list[booking_card];
            let card = this.cloneBookingCard();


            let output_elements = {
                'time': true,
                'created_time': true,
                'name': true,
                'phone': true,
                'email': true,
                'message': true
            };
            for (let key in booking_card) {
                if (output_elements[key]) {
                    card.querySelector('.card-' + key).querySelector('div.value').innerHTML = booking_card[key];
                }
            }

            switch (booking_card['status']) {
                case '1':
                    card.querySelector('ul.booking-card').className = 'booking-card booking-card-approved';
                    card.querySelector('li.card-label').querySelector('div.value').innerHTML = 'Заявка подтверждена';
                    break;
                case '0':
                    card.querySelector('ul.booking-card').className = 'booking-card booking-card-declined';
                    card.querySelector('li.card-label').querySelector('div.value').innerHTML = 'Заявка отклонена';
                    break;
            }
            card.id = booking_card['id'];
            card.querySelector('.anchor').querySelector('a').id = 'card-' + booking_card['id'];
            card.querySelector('.card-buttons').querySelector('.booking-approve').href = '/api/booking/approve/' + booking_card['id'];
            card.querySelector('.card-buttons').querySelector('.booking-decline').href = '/api/booking/decline/' + booking_card['id'];

            this.makeBookingCard(card);
        }
    }

    generateError(message, card_id) {
        super.generateBlockError(message, document.getElementById(card_id));
    }

    generateSuccess(message, card_id) {
        // super.generateBlockError(message, document.getElementById(card_id));
    }

    cloneBookingCard() {
        let card_control = document.querySelector('.booking-card-control');
        let card = card_control.cloneNode(true);
        card.style.display = 'block';

        return card;
    }

    makeBookingCard(card) {
        document.querySelector('.booking-card-control').after(card);
    }

    clearPage() {
        let bookings = document.querySelectorAll('.booking-card-control');

        for (let i = 1; i < bookings.length; i++) {
            bookings[i].remove()
        }
    }
}


// new OperatorMenu()