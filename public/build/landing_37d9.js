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

/***/ "../js/BookingForm.js":
/*!****************************!*\
  !*** ../js/BookingForm.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BookingForm)
/* harmony export */ });
/* harmony import */ var _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Validators/CheckLength */ "../js/Validators/CheckLength.js");
/* harmony import */ var _xhr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr */ "../js/xhr.js");
/* harmony import */ var _date_convert__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./date-convert */ "../js/date-convert.js");
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BaseForm */ "../js/BaseForm.js");
/* harmony import */ var _Validators_TimeSlotValidate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Validators/TimeSlotValidate */ "../js/Validators/TimeSlotValidate.js");





class BookingForm extends _BaseForm__WEBPACK_IMPORTED_MODULE_3__["default"] {
  form_selector = '#booking-form';
  time_slots;
  input_validation_rules = {
    'input_name': {
      'checkLength': new _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_0__["default"]({
        'min_length': 2,
        'max_length': 100
      })
    },
    'input_email': {
      'checkLength': new _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_0__["default"]({
        'min_length': 2,
        'max_length': 100
      })
    },
    'input_phone': {
      'checkLength': new _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_0__["default"]({
        'min_length': 10,
        'max_length': 20
      })
    },
    'input_booking-msg': {
      'checkLength': new _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_0__["default"]({
        'min_length': 2,
        'max_length': 4096
      })
    }
  };
  constructor(date) {
    super();
    this.date = date;
    this.DateConvert = new _date_convert__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.setTimeSlotDataToForm(date);
    let self = this;
    let bookingForm = document.querySelector('.booking-form');
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      self.submit();
    });
  }
  setTimeSlots(time_slots) {
    this.time_slots = time_slots;
  }
  setTimeSlotDataToForm(date) {
    let disabled_booking_time_input = document.querySelector('.disabled_booking_time');
    disabled_booking_time_input.value = this.DateConvert.convertDateTime(date);
    let hidden_booking_time_input = document.querySelector('.hidden_booking_time');
    hidden_booking_time_input.value = date;
    let repair_input = document.querySelector('#repair');
    let input_booking_msg = document.querySelector('#input_booking-msg');
    input_booking_msg.placeholder = repair_input.value + ', добавьте описание необходимого ремонта'; // @TODO: заменить на placeholder
  }

  renderUserError(message) {
    // удалить существующий блок с ошибкой
    // this.removeErrors('.booking-error');

    super.generateBlockError(message, document.querySelector('.booking-form'));
  }

  /**
   *
   * @returns {*}
   */
  isValid() {
    let valid = true;
    for (let input_name in this.input_validation_rules) {
      if (this.fieldValidate(input_name) !== true) {
        valid = false;
      }
    }
    try {
      this.removeErrors('.booking-error');
      let timeSlotValidate = new _Validators_TimeSlotValidate__WEBPACK_IMPORTED_MODULE_4__["default"](this.time_slots);
      timeSlotValidate.checkTimeSlot(document.querySelector('#input_hidden_time').value);
    } catch (Error) {
      valid = false;
      this.renderUserError(Error);
    }
    return valid;
  }
  fieldValidate(input_name) {
    let field = document.querySelector('#' + input_name);
    let input = this.input_validation_rules[input_name];
    for (let validator in input) {
      this.removeErrors('#' + field.id + '_error');
      //  перебор указанных валидаторов поля
      try {
        if (input[validator].checkLength(field)) {
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

      let newXHR = new _xhr__WEBPACK_IMPORTED_MODULE_1__["default"]('POST', this.makeJSON(), '/api/booking');
      let json_promise = newXHR.getXhr();
      let self = this;
      json_promise.then(function (result) {
        console.log('отправка на сервер');
        let json_response = JSON.parse(result);
        let response = json_response['response'];
        if (response === 'OK') {
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
        if (response === 'error' || response === 'exception') {
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

/***/ }),

/***/ "../js/RepairForm.js":
/*!***************************!*\
  !*** ../js/RepairForm.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TimeSlots__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TimeSlots */ "../js/TimeSlots.js");
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BaseForm */ "../js/BaseForm.js");
/* harmony import */ var _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Validators/CheckLength */ "../js/Validators/CheckLength.js");



class RepairForm extends _BaseForm__WEBPACK_IMPORTED_MODULE_1__["default"] {
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
        let checkLength = new _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_2__["default"](params);
        checkLength.checkLength(input_repair_form);

        // удалить прошлый ответ формы
        self.removeErrors('#repair_error');
        self.removeErrors('.repair_response');
        self.removeErrors('.time-slots-control');
        self.removeErrors('.booking-success');
        self.removeErrors('#booking-error');
        self.RepairMessage();
        let timeSlots = new _TimeSlots__WEBPACK_IMPORTED_MODULE_0__["default"]();
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

/***/ }),

/***/ "../js/SearchForm.js":
/*!***************************!*\
  !*** ../js/SearchForm.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cookie_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cookie-manager */ "../js/cookie-manager.js");
/* harmony import */ var _BaseForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BaseForm */ "../js/BaseForm.js");
/* harmony import */ var _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Validators/CheckLength */ "../js/Validators/CheckLength.js");



class SearchForm extends _BaseForm__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super();
    let elementForm = document.querySelector('#search-form');
    let self = this;
    elementForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let params = {
        'min_length': 2,
        'max_length': 75
      };
      let checkLength = new _Validators_CheckLength__WEBPACK_IMPORTED_MODULE_2__["default"](params);
      let input_search_form = document.querySelector('#spare_part');

      //validation
      try {
        self.removeErrors('#spare_part_error');
        checkLength.checkLength(input_search_form);
        self.Search();
      } catch (error) {
        self.generateError(error, '#spare_part');
      }
    });
  }
  Search() {
    let search_input = document.getElementById('spare_part').value;
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }

    if (search_input) {
      let map_cookie = new Map();
      let cookieManager = new _cookie_manager__WEBPACK_IMPORTED_MODULE_0__["default"]();
      if (cookieManager.getCookie('quantity_item') === undefined) {
        map_cookie.set(search_input, getRandomIntInclusive(10, 199));
        // сериализация и запись в куку
        let objFromMap = Object.fromEntries(map_cookie);
        let serialize_map_cookie = JSON.stringify(objFromMap);
        cookieManager.setCookie('quantity_item', serialize_map_cookie, {
          'max-age': 3 * 3600
        });
      } else {
        // сериализация и запись в куку
        let cookie = JSON.parse(cookieManager.getCookie('quantity_item'));
        map_cookie = new Map(Object.entries(cookie));
        if (!map_cookie.has(search_input)) {
          map_cookie.set(search_input, getRandomIntInclusive(10, 199));
          let objFromMap = Object.fromEntries(map_cookie);
          let serialize_map_cookie = JSON.stringify(objFromMap);
          cookieManager.setCookie('quantity_item', serialize_map_cookie, {
            'max-age': 3 * 3600
          });
        }
      }
      document.getElementById('search_response').innerHTML = 'Поиск выполнен успешно, ' + document.getElementById('spare_part').value + ' в наличии на складе, в размере ' + map_cookie.get(search_input) + ' шт.';
    }
  }
}
new SearchForm();

/***/ }),

/***/ "../js/TimeSlots.js":
/*!**************************!*\
  !*** ../js/TimeSlots.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimeSlots)
/* harmony export */ });
/* harmony import */ var _xhr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./xhr */ "../js/xhr.js");
/* harmony import */ var _BookingForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BookingForm */ "../js/BookingForm.js");
/* harmony import */ var _date_convert__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./date-convert */ "../js/date-convert.js");



class TimeSlots {
  constructor() {
    let xhr = new _xhr__WEBPACK_IMPORTED_MODULE_0__["default"]('GET', '', '/api/not-booked-time');
    this.json_promise = xhr.getXhr();
  }
  render() {
    let parent_this = this;
    this.json_promise.then(function (result) {
      let json = JSON.parse(result);
      let time_slots = json['time_slots'];
      if (json['response'] === 'OK') {
        parent_this.makeHtml(time_slots);

        // обработка выбранного тайм-слота
        document.querySelector('.time-slots-control').onclick = function (event) {
          let target = event.target;
          console.log(target);
          if (target.tagName === 'BUTTON') {
            let booking_form = document.querySelector('.booking-form');
            booking_form.style.display = 'flex';
            booking_form.scrollIntoView({
              behavior: "smooth",
              block: "end"
            });
            let booking = new _BookingForm__WEBPACK_IMPORTED_MODULE_1__["default"](target.value);
            booking.setTimeSlots(time_slots);
          }
        };
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
        // добавить каждую кнопку в div.today/tomorrow div.content
        document.querySelector('.' + today_or_tomorrow).querySelector('.content').append(time_slot_button);
      }
    }
  }
  makeHtml(time_slots) {
    let time_slots_parent_div = document.createElement('div');
    let clearfix = document.createElement('div');
    let time_slots_today = document.createElement('div');
    let time_slots_today_header_div = document.createElement('div');
    let time_slots_today_content_div = document.createElement('div');
    let time_slots_tomorrow = document.createElement('div');
    let time_slots_tomorrow_header_div = document.createElement('div');
    let time_slots_tomorrow_content_div = document.createElement('div');
    let today_h2 = document.createElement('h2');
    let tomorrow_h2 = document.createElement('h2');
    time_slots_parent_div.className = 'time-slots-control';
    clearfix.className = 'clearfix';
    time_slots_today.className = 'time-slots today';
    time_slots_today_header_div.className = 'header';
    time_slots_today_content_div.className = 'content';
    time_slots_tomorrow.className = 'time-slots tomorrow';
    time_slots_tomorrow_header_div.className = 'header';
    time_slots_tomorrow_content_div.className = 'content';
    document.querySelector('.repair-form').after(time_slots_parent_div);
    let date_convert = new _date_convert__WEBPACK_IMPORTED_MODULE_2__["default"]();
    date_convert.convertDate(time_slots['today']['09:00']['date']);
    today_h2.innerHTML = "Доступное время на сегодня (" + date_convert.convertDate(time_slots['today']['09:00']['date']) + "):";

    // добавить div header в div time_slots_today
    time_slots_today.append(time_slots_today_header_div);
    // добавить div content в div time_slots_today
    time_slots_today.append(time_slots_today_content_div);
    // добавить заголовок в div header
    time_slots_today_header_div.append(today_h2);

    // добавить div с тайм-слотами на сегодня в родительский div
    time_slots_parent_div.append(time_slots_today);
    // time_slots_parent_div.append(clearfix);

    tomorrow_h2.innerHTML = "Доступное время на завтра (" + date_convert.convertDate(time_slots['tomorrow']['09:00']['date']) + "):";
    // добавить div header в div time_slots_tomorrow
    time_slots_tomorrow.prepend(time_slots_tomorrow_header_div);
    // добавить div content в div time_slots_tomorrow
    time_slots_tomorrow.append(time_slots_tomorrow_content_div);
    // добавить заголовок в div header
    time_slots_tomorrow_header_div.append(tomorrow_h2);

    // добавить div с тайм-слотами на завтра в родительский div
    time_slots_parent_div.append(time_slots_tomorrow);
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

/***/ "../js/Validators/TimeSlotValidate.js":
/*!********************************************!*\
  !*** ../js/Validators/TimeSlotValidate.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimeSlotValidate)
/* harmony export */ });
/* harmony import */ var _BaseValidator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseValidator */ "../js/Validators/BaseValidator.js");
/* harmony import */ var _xhr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../xhr */ "../js/xhr.js");
/* harmony import */ var _BookingForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../BookingForm */ "../js/BookingForm.js");



class TimeSlotValidate extends _BaseValidator__WEBPACK_IMPORTED_MODULE_0__["default"] {
  time_slots;
  constructor(time_slots) {
    super();
    this.time_slots = time_slots;
  }
  checkTimeSlot(user_time_slot) {
    console.log('check:', this.time_slots);
    let error_message = 'Дата некорректна!';
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

/***/ }),

/***/ "../js/cookie-manager.js":
/*!*******************************!*\
  !*** ../js/cookie-manager.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cookie)
/* harmony export */ });
class Cookie {
  getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  setCookie(name, value, options = {}) {
    options = {
      path: '/',
      // при необходимости добавьте другие значения по умолчанию
      ...options
    };
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    document.cookie = updatedCookie;
  }
}

/***/ }),

/***/ "../js/date-convert.js":
/*!*****************************!*\
  !*** ../js/date-convert.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DateConvert)
/* harmony export */ });
class DateConvert {
  constructor() {
    this.days_of_week_in_russian = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
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

/***/ "../less/main-landing.less":
/*!*********************************!*\
  !*** ../less/main-landing.less ***!
  \*********************************/
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
/*!************************!*\
  !*** ../js/landing.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _RepairForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RepairForm */ "../js/RepairForm.js");
/* harmony import */ var _SearchForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SearchForm */ "../js/SearchForm.js");
/* harmony import */ var _BookingForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BookingForm */ "../js/BookingForm.js");
/* harmony import */ var _less_main_landing_less__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../less/main-landing.less */ "../less/main-landing.less");




})();

/******/ })()
;