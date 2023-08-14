import XHR from '../Utils/xhr';
import BaseForm from "../Form/BaseForm";
import Paginator from "../Paginator/Paginator";

export default class OperatorMenu extends BaseForm {
    json_promise;
    is_approved;
    count_pages;
    router;

    constructor(router) {
        super();
        this.router = router;
        this.getList(this.router.getRoute());
    }


    getList(route) {
        let xhr = new XHR('GET', '', '/api/booking' + route);
        this.json_promise = xhr.getXhr();
        let self = this;
        this.json_promise.then(function (result) {
            let json = (JSON.parse(result));
            if (json['response'] === 'OK') {
                let booking_list = json['page-array']['page'];
                self.count_pages = json['page-array']['count_pages'];
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
        // this.paginationHandler();
        this.pagination();
    }

    buttonHandler() {
        // кнопки подтвердить/отклонить/редактировать
        let card_list = document.querySelectorAll('.booking-card-control');
        let self = this;
        Array.from(card_list).forEach(function (card) {

            card.querySelector('.card-buttons').onclick = function (event) {
                let target = event.target;

                switch (target.className) {
                    case 'btn btn-wide btn-outline-danger booking-decline':
                        self.areYouSure(card, target);
                        break;
                    case 'btn btn-wide btn-outline-success booking-approve':
                        self.areYouSure(card, target);
                        break;
                    case 'btn btn-wide btn-outline-secondary booking-edit':
                        self.editBooking(card);
                        break;

                }
            }
        });
        // кнопки пагинатора
        let nav = document.querySelector('div.paginator-control').querySelector('nav');
        nav.onclick = function (event) {
            event.preventDefault();
            let target = event.target;

            if (target.tagName === 'A' && target.textContent !== '...') {

                self.clearPage();
                self.getList(target.name);
                self.router.setRoute(target.name);
                // target.classList.toggle('active');
            }
        }
        // выбор кол-ва записей на странице
        let select = document.querySelector('div.set-limit').querySelector('select');
        select.onclick = function (event) {
            // event.preventDefault();
            let target = event.target;

            if (target.tagName === 'OPTION') {
                console.log(target.value);
                self.router.setLimit(target.value);
                console.log(self.router.getLimit());
                console.log(self.router.getRoute());

                self.clearPage();
                self.getList(self.router.getRoute());
            }


            // target.classList.toggle('active');

        }
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
                    let json = (JSON.parse(result));
                    if (json['response'] === 'success') {

                        self.clearPage();
                        self.getList(self.router.getRoute());
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
                self.getList(self.router.getRoute());
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

    pagination() {
        let nav = document.querySelector('div.paginator-control').querySelector('nav');
        let paginator = new Paginator(nav, this.router, this.count_pages);
        // paginator.paginationHandler();
    }

    paginationHandler() {

        let nav = document.querySelector('div.paginator-control').querySelector('nav');
        let middle = nav.querySelector('div.middle');
        this.paginationClear(middle);
        let a = document.createElement('a');
        let route_obj = this.router.routeExplode(this.router.getRoute());

        // если страница единственная, скрыть панель пагинатора
        if (this.count_pages === 1) {
            // nav.style.display = 'none';
            nav.className = 'disabled';
        } else {
            nav.className = 'enabled';
            if (+route_obj['page'] - 1 === 0) {

                console.log('-1 =  0');

                nav.querySelector('div.previous-button').querySelector('a').className = 'disabled';
            } else {
                console.log('-1 =  0 els');

                let route_obj_local = route_obj;
                route_obj_local['page'] = +route_obj_local['page'] - 1;
                nav.querySelector('div.previous-button').querySelector('a').name = this.router.makeRoute(route_obj_local);
                nav.querySelector('div.previous-button').querySelector('a').className = 'enabled';
            }
            if (+route_obj['page'] + 1 > +this.count_pages) {
                console.log('+1> pages');
                nav.querySelector('div.next-button').querySelector('a').className = 'disabled';

            } else {
                console.log('+1 < pages');
                console.log(+route_obj['page']);

                let route_obj_local = route_obj;
                route_obj_local['page'] = +route_obj_local['page'] + 1;
                nav.querySelector('div.next-button').querySelector('a').name = this.router.makeRoute(route_obj_local);
                nav.querySelector('div.next-button').querySelector('a').className = 'enabled';
            }
        }

        if (this.count_pages < 6) {
            for (let page = 1; page <= this.count_pages; page++) {

                route_obj['page'] = page;
                let local_a = a.cloneNode(true);
                local_a.innerHTML = page;
                local_a.className = 'enabled';
                local_a.name = this.router.makeRoute(route_obj);
                middle.append(local_a);
            }

            // если страниц больше 6
        } else {
            // вывод кнопок для первых 2 страниц
            for (let page = 1; page < 3; page++) {

                route_obj['page'] = page;
                let local_a = a.cloneNode(true);
                local_a.innerHTML = page;
                local_a.className = 'enabled';
                local_a.name = this.router.makeRoute(route_obj);
                middle.append(local_a);
            }
            let local_a = a.cloneNode(true);
            local_a.innerHTML = '...';
            local_a.className = 'disabled';
            middle.append(local_a);

            // вывод кнопок для последних 2 страниц
            for (let page = this.count_pages - 1; page <= this.count_pages; page++) {

                route_obj['page'] = page;
                let local_a = a.cloneNode(true);
                local_a.innerHTML = page;
                local_a.className = 'enabled';
                local_a.name = this.router.makeRoute(route_obj);
                middle.append(local_a);
            }
        }

    }

    paginationClear(nav) {
        let paginator = nav.querySelectorAll('a');

        for (let i = 0; i < paginator.length; i++) {
            paginator[i].remove()
        }
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
