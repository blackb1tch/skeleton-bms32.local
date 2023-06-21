/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../js/BaseForm.js":
/*!*************************!*\
  !*** ../js/BaseForm.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseForm)
/* harmony export */ });
class BaseForm {
  constructor() {}
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
  removeErrors(error_class) {
    let errors = document.querySelectorAll(error_class);
    for (let i = 0; i < errors.length; i++) {
      errors[i].remove();
    }
  }
}

/***/ }),

/***/ "../js/OperatorMenu/OperatorMenu.js":
/*!******************************************!*\
  !*** ../js/OperatorMenu/OperatorMenu.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OperatorMenu)
/* harmony export */ });
/* harmony import */ var _xhr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../xhr */ "../js/xhr.js");
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../BaseForm */ "../js/BaseForm.js");
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Router */ "../js/OperatorMenu/Router.js");



class OperatorMenu extends _BaseForm__WEBPACK_IMPORTED_MODULE_1__["default"] {
  json_promise;
  page = 1;
  limit = 5;
  default_route = '/is-approved/null/sort-by/id/asc-or-desc/desc/page/1/limit/5';
  cache_route;
  is_approved;
  count_pages;
  // router;

  constructor(cache_route) {
    super();
    // this.router = new Router();
    this.cache_route = cache_route;
    this.getList(this.default_route);
  }
  setRoute(cache_route) {
    this.cache_route = cache_route;
  }
  getList(route) {
    let xhr = new _xhr__WEBPACK_IMPORTED_MODULE_0__["default"]('GET', '', '/api/booking' + route);
    this.json_promise = xhr.getXhr();
    let self = this;
    this.json_promise.then(function (result) {
      let json = JSON.parse(result);
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
    this.paginationHandler();
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
      };
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
      if (target.className === 'btn btn-outline-danger booking-decline' || target.className === 'btn btn-outline-success booking-approve') {
        let xhr = new _xhr__WEBPACK_IMPORTED_MODULE_0__["default"]('PUT', '', target.href);
        let approve = xhr.getXhr();
        approve.then(function (result) {
          let json = JSON.parse(result);
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
        button_are_you_sure.style.display = 'none';
        li_are_you_sure.style.display = 'none';
      }
    };
  }
  editBooking(card) {
    let form = card.querySelector('form');
    form.className = 'form-enabled';
    let edit_fields = {
      'card-name': true,
      'card-phone': true,
      'card-email': true,
      'card-message': true,
      'card-time': true
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
    let xhr = new _xhr__WEBPACK_IMPORTED_MODULE_0__["default"]('PUT', this.makeJSON(formData, card_id), '/api/booking/edit/' + card_id);
    let edit_promise = xhr.getXhr();
    let self = this;
    edit_promise.then(function (result) {
      let json = JSON.parse(result);
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
  paginationHandler() {
    this.routeExplode(this.cache_route);
    let nav = document.querySelector('div.paginator-control').querySelector('nav');
    let middle = nav.querySelector('div.middle');
    this.clearPaginator(middle);
    let a = document.createElement('a');
    let route_obj = this.routeExplode(this.cache_route);

    // если страница единственная, скрыть панель пагинатора
    if (this.count_pages === 1) {
      nav.style.display = 'none';
    } else {
      if (route_obj['page'] - 1 === 0) {
        console.log('route_obj[\'page\'] -1 === 0');
        nav.querySelector('div.previous-button').querySelector('a').className = 'disabled';
      } else {
        console.log('else');
        nav.querySelector('div.previous-button').querySelector('a').href = +route_obj['page'] - 1;
        nav.querySelector('div.previous-button').querySelector('a').className = 'enabled';
      }
      if (route_obj['page'] + 1 > this.count_pages) {
        console.log('route_obj[\'page\']+1 >this.count_pages');
        nav.querySelector('div.next-button').querySelector('a').className = 'disabled';
      } else {
        nav.querySelector('div.next-button').querySelector('a').href = route_obj['page'] + 1;
        nav.querySelector('div.next-button').querySelector('a').className = 'enabled';
      }
    }
    if (this.count_pages < 6) {
      console.log(typeof route_obj['page']);
      for (let page = 1; page <= this.count_pages; page++) {
        route_obj['page'] = page;
        let local_a = a.cloneNode(true);
        local_a.innerHTML = page;
        local_a.className = 'enabled';
        local_a.href = this.makeRoute(route_obj);
        middle.append(local_a);
      }

      // если страниц больше 6
    } else {
      // вывод первых 2 страниц
      for (let page = 1; page < 3; page++) {
        route_obj['page'] = page;
        let local_a = a.cloneNode(true);
        local_a.innerHTML = page;
        local_a.className = 'enabled';
        local_a.href = this.makeRoute(route_obj);
        middle.append(local_a);
      }
      let local_a = a.cloneNode(true);
      local_a.innerHTML = '...';
      local_a.className = 'disabled';
      middle.append(local_a);

      // вывод последних 2 страниц
      for (let page = this.count_pages - 1; page <= this.count_pages; page++) {
        route_obj['page'] = page;
        let local_a = a.cloneNode(true);
        local_a.innerHTML = page;
        local_a.className = 'enabled';
        local_a.href = this.makeRoute(route_obj);
        middle.append(local_a);
      }
    }
  }
  clearPaginator(nav) {
    let paginator = nav.querySelectorAll('a');
    for (let i = 0; i < paginator.length; i++) {
      paginator[i].remove();
    }
  }
  routeExplode(route) {
    let route_obj = {};
    let route_array = route.split('/');
    for (let key = 1; key < route_array.length; key += 2) {
      let arr_elem = route_array[key];
      route_obj[arr_elem] = route_array[key + 1];
    }
    return route_obj;
  }
  makeRoute(route_obj) {
    let make_route = '/';
    for (let key in route_obj) {
      if (key !== 'limit') {
        make_route = make_route + key + '/' + route_obj[key] + '/';
      } else {
        make_route = make_route + key + '/' + route_obj[key];
      }
    }
    return make_route;
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
      bookings[i].remove();
    }
  }
}

// new OperatorMenu()

/***/ }),

/***/ "../js/OperatorMenu/Router.js":
/*!************************************!*\
  !*** ../js/OperatorMenu/Router.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Router)
/* harmony export */ });
class Router {
  default_route_obj = {};
  cached_route;
  getRoute() {
    return this.cached_route;
  }
  setRoute(route) {
    this.cached_route = route;
  }
  setCookieRoute() {}
  routeExplode(route) {
    let route_obj = {};
    let route_array = route.split('/');
    for (let key = 1; key < route_array.length; key += 2) {
      let arr_elem = route_array[key];
      route_obj[arr_elem] = route_array[key + 1];
    }
    return route_obj;
  }
  makeRoute(route_obj) {
    let make_route = '/';
    for (let key in route_obj) {
      if (key !== 'limit') {
        make_route = make_route + key + '/' + route_obj[key] + '/';
      } else {
        make_route = make_route + key + '/' + route_obj[key];
      }
    }
    return make_route;
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/BaseControl.js":
/*!************************************************!*\
  !*** ../js/OperatorMenu/filter/BaseControl.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseControl)
/* harmony export */ });
class BaseControl {
  Validate() {}
  generateError(error_message = '', field_id = '') {}
  generateSuccess() {}
  getValue(field) {
    return field.value;
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/ControlValidators/BookingMessageValidate.js":
/*!*****************************************************************************!*\
  !*** ../js/OperatorMenu/filter/ControlValidators/BookingMessageValidate.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BookingMessageValidate)
/* harmony export */ });
class BookingMessageValidate {}

/***/ }),

/***/ "../js/OperatorMenu/filter/ControlValidators/DateValidate.js":
/*!*******************************************************************!*\
  !*** ../js/OperatorMenu/filter/ControlValidators/DateValidate.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DateValidate)
/* harmony export */ });
/* harmony import */ var _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../Validators/BaseValidator */ "../js/Validators/BaseValidator.js");

class DateValidate extends _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super();
  }
  Validate(field_value) {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (field_value.match(dateRegex)) {
      return true;
    } else {
      throw 'Не верный формат даты: ' + field_value + '! Ожидается формат: YYYY-MM-DD';
    }
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/ControlValidators/EmailValidate.js":
/*!********************************************************************!*\
  !*** ../js/OperatorMenu/filter/ControlValidators/EmailValidate.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmailValidate)
/* harmony export */ });
/* harmony import */ var _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../Validators/BaseValidator */ "../js/Validators/BaseValidator.js");
/* harmony import */ var _Validators_CheckEmail__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Validators/CheckEmail */ "../js/Validators/CheckEmail.js");


class EmailValidate extends _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super();
  }
  Validate(field_value) {
    try {
      let checkEmail = new _Validators_CheckEmail__WEBPACK_IMPORTED_MODULE_1__["default"](field_value);
      return checkEmail.checkEmail();
    } catch (Error) {
      throw Error;
    }
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/ControlValidators/IdValidate.js":
/*!*****************************************************************!*\
  !*** ../js/OperatorMenu/filter/ControlValidators/IdValidate.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IdValidate)
/* harmony export */ });
/* harmony import */ var _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../Validators/BaseValidator */ "../js/Validators/BaseValidator.js");

class IdValidate extends _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super();
  }
  Validate(field_value) {
    let regexp = /\d/;
    if (field_value.match(regexp)) {
      return true;
    } else {
      throw 'Id введен не верно!';
    }
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/ControlValidators/NameValidate.js":
/*!*******************************************************************!*\
  !*** ../js/OperatorMenu/filter/ControlValidators/NameValidate.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NameValidate)
/* harmony export */ });
/* harmony import */ var _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../Validators/BaseValidator */ "../js/Validators/BaseValidator.js");
/* harmony import */ var _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Validators/CheckLength */ "../js/Validators/CheckLength.js");


class NameValidate extends _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  CheckLength;
  constructor() {
    super();
    let params = {
      'min_length': 2,
      'max_length': 100
    };
    this.CheckLength = new _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_1__["default"](params);
  }
  Validate(field_value) {
    try {
      //@TODO: ошибка - ожидается DOM элемент, отправляется его значение
      return this.CheckLength.checkLength(field_value);
    } catch (Error) {
      throw Error;
    }
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/ControlValidators/PhoneValidate.js":
/*!********************************************************************!*\
  !*** ../js/OperatorMenu/filter/ControlValidators/PhoneValidate.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PhoneValidate)
/* harmony export */ });
/* harmony import */ var _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../Validators/BaseValidator */ "../js/Validators/BaseValidator.js");
/* harmony import */ var _Validators_CheckPhone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../Validators/CheckPhone */ "../js/Validators/CheckPhone.js");


class PhoneValidate extends _Validators_BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  format = 'rus';
  constructor() {
    super();
  }
  Validate(field_value) {
    try {
      let checkPhone = new _Validators_CheckPhone__WEBPACK_IMPORTED_MODULE_1__["default"](field_value);
      return checkPhone.checkPhone(this.format);
    } catch (Error) {
      throw Error;
    }
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/ControlValidators/SearchControlValidatorsList.js":
/*!**********************************************************************************!*\
  !*** ../js/OperatorMenu/filter/ControlValidators/SearchControlValidatorsList.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SearchControlValidatorsList)
/* harmony export */ });
/* harmony import */ var _BookingMessageValidate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BookingMessageValidate */ "../js/OperatorMenu/filter/ControlValidators/BookingMessageValidate.js");
/* harmony import */ var _EmailValidate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmailValidate */ "../js/OperatorMenu/filter/ControlValidators/EmailValidate.js");
/* harmony import */ var _IdValidate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IdValidate */ "../js/OperatorMenu/filter/ControlValidators/IdValidate.js");
/* harmony import */ var _NameValidate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NameValidate */ "../js/OperatorMenu/filter/ControlValidators/NameValidate.js");
/* harmony import */ var _PhoneValidate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PhoneValidate */ "../js/OperatorMenu/filter/ControlValidators/PhoneValidate.js");





class SearchControlValidatorsList {
  getList() {
    return {
      'BookingMessageValidate': new _BookingMessageValidate__WEBPACK_IMPORTED_MODULE_0__["default"](),
      'EmailValidate': new _EmailValidate__WEBPACK_IMPORTED_MODULE_1__["default"](),
      'IdValidate': new _IdValidate__WEBPACK_IMPORTED_MODULE_2__["default"](),
      'NameValidate': new _NameValidate__WEBPACK_IMPORTED_MODULE_3__["default"](),
      'PhoneValidate': new _PhoneValidate__WEBPACK_IMPORTED_MODULE_4__["default"]()
    };
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/ControlsList.js":
/*!*************************************************!*\
  !*** ../js/OperatorMenu/filter/ControlsList.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ControlsList)
/* harmony export */ });
/* harmony import */ var _SearchByDateControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SearchByDateControl */ "../js/OperatorMenu/filter/SearchByDateControl.js");
/* harmony import */ var _SearchControl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SearchControl */ "../js/OperatorMenu/filter/SearchControl.js");
/* harmony import */ var _SortByIdControl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SortByIdControl */ "../js/OperatorMenu/filter/SortByIdControl.js");
/* harmony import */ var _SortByStatusControl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SortByStatusControl */ "../js/OperatorMenu/filter/SortByStatusControl.js");




class ControlsList {
  getList() {
    return {
      'SortByStatusControl': new _SortByStatusControl__WEBPACK_IMPORTED_MODULE_3__["default"](),
      'SortByBookingControl': new _SortByIdControl__WEBPACK_IMPORTED_MODULE_2__["default"](),
      'SearchControl': new _SearchControl__WEBPACK_IMPORTED_MODULE_1__["default"](),
      'SearchByDateControl': new _SearchByDateControl__WEBPACK_IMPORTED_MODULE_0__["default"]()
    };
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/OperatorFilter.js":
/*!***************************************************!*\
  !*** ../js/OperatorMenu/filter/OperatorFilter.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ControlsList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ControlsList */ "../js/OperatorMenu/filter/ControlsList.js");
/* harmony import */ var _OperatorMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../OperatorMenu */ "../js/OperatorMenu/OperatorMenu.js");
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Router */ "../js/OperatorMenu/Router.js");



class OperatorFilter {
  cache_route = '/is-approved/null/sort-by/id/asc-or-desc/desc/page/1/limit/5';
  default_route = '/is-approved/null/sort-by/id/asc-or-desc/desc/page/1/limit/5';
  router = new _Router__WEBPACK_IMPORTED_MODULE_2__["default"]();
  operatorMenu = new _OperatorMenu__WEBPACK_IMPORTED_MODULE_1__["default"](this.cache_route);
  constructor() {
    let filter_control = document.querySelector('#filter-control');
    let self = this;
    document.querySelector('.filter').oninput = function (event) {
      let target = event.target;
      let controlsList = new _ControlsList__WEBPACK_IMPORTED_MODULE_0__["default"]();
      controlsList = controlsList.getList();
      if (target.tagName === 'INPUT') {
        let route = '';
        for (let control in controlsList) {
          try {
            if (controlsList[control].Validate()) {
              route = route + controlsList[control].getRoute();
            }
          } catch (Error) {
            controlsList[control].generateError(Error);
          }
        }
        route = route + '/page/1/limit/5';
        if (self.cache_route !== route) {
          // кеш роута
          self.cache_route = route;
          self.operatorMenu.setRoute(self.cache_route);
          // передать данные на сервер
          self.operatorMenu.clearPage();
          self.operatorMenu.getList(route);
        }
      }
    };
    document.querySelector('#reset-btn').onclick = function (event) {
      let target = event.target;
      if (target.tagName === 'INPUT') {
        if (self.cache_route !== self.default_route) {
          self.cache_route = self.default_route;
          self.operatorMenu.clearPage();
          self.operatorMenu.getList(self.default_route);
        }
      }
    };
  }
}
new OperatorFilter();

/***/ }),

/***/ "../js/OperatorMenu/filter/SearchByDateControl.js":
/*!********************************************************!*\
  !*** ../js/OperatorMenu/filter/SearchByDateControl.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SearchByDateControl)
/* harmony export */ });
/* harmony import */ var _BaseControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseControl */ "../js/OperatorMenu/filter/BaseControl.js");
/* harmony import */ var _ControlValidators_DateValidate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ControlValidators/DateValidate */ "../js/OperatorMenu/filter/ControlValidators/DateValidate.js");
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../BaseForm */ "../js/BaseForm.js");



class SearchByDateControl extends _BaseControl__WEBPACK_IMPORTED_MODULE_0__["default"] {
  dateValidate = new _ControlValidators_DateValidate__WEBPACK_IMPORTED_MODULE_1__["default"]();
  BaseForm = new _BaseForm__WEBPACK_IMPORTED_MODULE_2__["default"]();
  date_from = document.querySelector('#date-search').querySelector('#search-date-from');
  date_to = document.querySelector('#date-search').querySelector('#search-date-to');
  for_error = document.querySelector('#date-search').querySelector('#search-by-date');
  radio_field = document.querySelector('#date-search').querySelector('input[type=radio]:checked');
  constructor() {
    super();
  }
  Validate() {
    let self = this;
    let validate = true;
    if (!self.date_from.value.length) {
      self.removeErrors();
      return false;
    }
    if (!self.date_to.value.length) {
      self.removeErrors();
      return false;
    }
    this.date_from.oninput = function () {
      try {
        self.removeErrors();
        return self.dateValidate.Validate(self.date_from.value.trim());
      } catch (Error) {
        validate = false;
        throw Error;
      }
    }();
    this.date_to.oninput = function () {
      try {
        self.removeErrors();
        return self.dateValidate.Validate(self.date_to.value.trim());
      } catch (Error) {
        validate = false;
        throw Error;
      }
    }();
    return true;
  }
  generateError(Error) {
    this.BaseForm.generateError(Error, '#' + this.for_error.id);
  }
  removeErrors() {
    this.BaseForm.removeErrors('#' + this.for_error.id + '_error');
  }
  getValue(field) {
    return super.getValue(this.field);
  }
  getRoute() {
    return '/date-or-create-date/' + this.radio_field.value + '/from/' + this.date_from.value + '/to/' + this.date_to.value;
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/SearchControl.js":
/*!**************************************************!*\
  !*** ../js/OperatorMenu/filter/SearchControl.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SearchControl)
/* harmony export */ });
/* harmony import */ var _BaseControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseControl */ "../js/OperatorMenu/filter/BaseControl.js");
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../BaseForm */ "../js/BaseForm.js");
/* harmony import */ var _ControlValidators_SearchControlValidatorsList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ControlValidators/SearchControlValidatorsList */ "../js/OperatorMenu/filter/ControlValidators/SearchControlValidatorsList.js");



class SearchControl extends _BaseControl__WEBPACK_IMPORTED_MODULE_0__["default"] {
  radio_field = document.querySelector('#search-by-message').querySelector('input[type=radio]:checked');
  text_field = document.querySelector('#search-by-message').querySelector('input[type=text]');
  ValidatorsList = new _ControlValidators_SearchControlValidatorsList__WEBPACK_IMPORTED_MODULE_2__["default"]();
  BaseForm = new _BaseForm__WEBPACK_IMPORTED_MODULE_1__["default"]();
  constructor() {
    super();
    this.ValidatorsList = this.ValidatorsList.getList();
  }
  Validate() {
    let self = this;
    let validate = true;
    if (!self.text_field.value.length) {
      self.removeErrors();
      return false;
    }
    this.text_field.oninput = function () {
      for (let validator in self.ValidatorsList) {
        if (validator === self.upName() + 'Validate') {
          try {
            self.removeErrors();
            return self.ValidatorsList[validator].Validate(self.text_field.value);
          } catch (Error) {
            validate = false;
            throw Error;
          }
        }
      }
    }();
    return validate;
  }
  getValue() {
    return {
      'radio': this.radio_field.value,
      'field': this.text_field.value
    };
  }
  getRoute() {
    return '/search-by/' + this.radio_field.value + '/search-word/' + this.text_field.value;
  }
  upName() {
    let value = this.radio_field.value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  removeErrors() {
    this.BaseForm.removeErrors('#' + this.text_field.id + '_error');
  }
  generateError(Error) {
    this.BaseForm.generateError(Error, '#' + this.text_field.id);
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/SortByIdControl.js":
/*!****************************************************!*\
  !*** ../js/OperatorMenu/filter/SortByIdControl.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SortByIdControl)
/* harmony export */ });
/* harmony import */ var _BaseControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseControl */ "../js/OperatorMenu/filter/BaseControl.js");
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../BaseForm */ "../js/BaseForm.js");


class SortByIdControl extends _BaseControl__WEBPACK_IMPORTED_MODULE_0__["default"] {
  field = document.querySelector('#sort-by-id').querySelector('input[type=radio]:checked');
  BaseForm = new _BaseForm__WEBPACK_IMPORTED_MODULE_1__["default"]();
  constructor() {
    super();
  }
  Validate() {
    return true;
    this.removeErrors();
    if (this.field.value === 'asc' || this.field.value === 'desc' || this.field.value === 'ASC' || this.field.value === 'DESC') {
      return true;
    }
    this.generateError();
    // switch (this.field.value) {
    //     case ('asc'):
    //         return true;
    //     case ('desc'):
    //         return true;
    //     case ('ASC'):
    //         return true;
    //     case ('DESC'):
    //         return true;
    //     default:
    //         this.generateError();
    // }
  }

  generateError() {
    return this.BaseForm.generateError('Сортировка (' + this.field.value + ') указана не верно!', '#' + this.field.id);
  }
  getValue() {
    return {
      'field': this.field.value
    };
  }
  getRoute() {
    return '/sort-by/id/asc-or-desc/' + this.field.value;
  }
}

/***/ }),

/***/ "../js/OperatorMenu/filter/SortByStatusControl.js":
/*!********************************************************!*\
  !*** ../js/OperatorMenu/filter/SortByStatusControl.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SortByStatusControl)
/* harmony export */ });
/* harmony import */ var _BaseControl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseControl */ "../js/OperatorMenu/filter/BaseControl.js");
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../BaseForm */ "../js/BaseForm.js");


class SortByStatusControl extends _BaseControl__WEBPACK_IMPORTED_MODULE_0__["default"] {
  field = document.querySelector('#sort-by-status').querySelector('input[type=radio]:checked');
  BaseForm = new _BaseForm__WEBPACK_IMPORTED_MODULE_1__["default"]();
  constructor() {
    super();
  }
  Validate() {
    this.removeErrors();
    if (this.field.value === 'null' || this.field.value === '0' || this.field.value === '1') {
      return true;
    }
    this.generateError();
  }
  removeErrors() {
    this.BaseForm.removeErrors('#' + this.field.id + '_error');
  }
  generateError() {
    return this.BaseForm.generateError('Статус (' + this.field.value + ') указан не верно!', '#' + this.field.id);
  }
  getValue() {
    return {
      'field': this.field.value
    };
  }
  getRoute() {
    return '/is-approved/' + this.field.value;
  }
}

/***/ }),

/***/ "../js/Validators/BaseValidator.js":
/*!*****************************************!*\
  !*** ../js/Validators/BaseValidator.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseValidator)
/* harmony export */ });
class BaseValidator {
  checkParams(default_params = {}, params = {}) {
    for (let param in default_params) {
      if (!params.hasOwnProperty(param)) {
        throw new Error('Отсутствует параметр ' + param);
      }
      if (typeof params[param] !== default_params[param]) {
        throw new Error('Параметр ' + param + ' ожидается ' + default_params[param] + ', получено: ' + params[param]);
      }
    }
  }
}

/***/ }),

/***/ "../js/Validators/CheckEmail.js":
/*!**************************************!*\
  !*** ../js/Validators/CheckEmail.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CheckEmail)
/* harmony export */ });
/* harmony import */ var _BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseValidator */ "../js/Validators/BaseValidator.js");

class CheckEmail extends _BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(field) {
    super();
    this.field = field;
  }
  checkEmail() {
    const emailRegex = /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/;
    if (this.field.match(emailRegex)) {
      return true;
    } else {
      throw 'Не верный формат E-mail!';
    }
  }
}

/***/ }),

/***/ "../js/Validators/CheckLength.js":
/*!***************************************!*\
  !*** ../js/Validators/CheckLength.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CheckLength)
/* harmony export */ });
/* harmony import */ var _BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseValidator */ "../js/Validators/BaseValidator.js");

class CheckLength extends _BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(params) {
    super();
    let default_params = {
      'min_length': 'number',
      'max_length': 'number'
    };
    this.checkParams(default_params, params);
    this.params = params;
    // this.checkLength();
  }

  checkLength(field) {
    if (field.value.length < this.params['min_length']) {
      let error_message = 'Поле не может быть менее ' + this.params['min_length'] + ' символов!';
      throw new Error(error_message);
    }
    if (field.value.length > this.params['max_length']) {
      let error_message = 'Поле не может быть более ' + this.params['max_length'] + ' символов!';
      throw new Error(error_message);
    }
    return true;

    // return true or throw err
  }
}

/***/ }),

/***/ "../js/Validators/CheckPhone.js":
/*!**************************************!*\
  !*** ../js/Validators/CheckPhone.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CheckPhone)
/* harmony export */ });
/* harmony import */ var _BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseValidator */ "../js/Validators/BaseValidator.js");

class CheckPhone extends _BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  field;
  constructor(field) {
    super();
    this.field = field;
  }
  setField(field) {
    this.field = field;
  }
  checkPhone(format) {
    if (format === 'rus') {
      let regexp = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
      if (!this.field.match(regexp)) {
        console.log('phoneErr');
        let error_message = 'Телефон должен соответствовать шаблону  +7(999)123-45-67!';
        throw error_message;
      } else return true;
    }
  }
}

/***/ }),

/***/ "../js/xhr.js":
/*!********************!*\
  !*** ../js/xhr.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ myXmlHttpRequest)
/* harmony export */ });
class myXmlHttpRequest {
  constructor(method, json_request, url = '/', async = true) {
    this.method = method;
    this.url = url;
    this.async = async;
    this.json_request = json_request;
    // this.json_response;
    this.xhr = new XMLHttpRequest();
  }
  getXhr() {
    return new Promise((resolve, reject) => {
      this.xhr.open(this.method, this.url, this.async);
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      this.xhr.onload = () => {
        if (this.xhr.status === 200) {
          resolve(this.xhr.response);
        } else {
          reject(new Error(`${this.xhr.status}: Адрес запроса не найден!`));
        }
      };
      this.xhr.onerror = () => {
        reject(new Error(`Ошибка! Не удалось отправить запрос!`));
      };
      this.xhr.send(this.json_request);
    });
  }
}

/***/ }),

/***/ "../less/operator.less":
/*!*****************************!*\
  !*** ../less/operator.less ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ../js/operator.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _OperatorMenu_filter_OperatorFilter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OperatorMenu/filter/OperatorFilter */ "../js/OperatorMenu/filter/OperatorFilter.js");
/* harmony import */ var _less_operator_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../less/operator.less */ "../less/operator.less");


})();

/******/ })()
;