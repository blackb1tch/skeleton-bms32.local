import CookieManager from "./cookie-manager";
import baseForm from "./BaseForm";
import CheckLength from "./Validators/CheckLength";

class SearchForm extends baseForm {

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
            let checkLength = new CheckLength(params);
            let input_search_form = document.querySelector('#spare_part');

            //validation
            try{
                self.removeErrors('#spare_part_error');
                checkLength.checkLength(input_search_form);
                self.Search();
            } catch (error){

                self.generateError(error,'#spare_part');
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
            let cookieManager = new CookieManager();


            if (cookieManager.getCookie('quantity_item') === undefined) {

                map_cookie.set(search_input, getRandomIntInclusive(10, 199));
                // сериализация и запись в куку
                let objFromMap = Object.fromEntries(map_cookie);
                let serialize_map_cookie = JSON.stringify(objFromMap);

                cookieManager.setCookie('quantity_item', serialize_map_cookie, {'max-age': 3 * 3600});
            } else {
                // сериализация и запись в куку
                let cookie = JSON.parse(cookieManager.getCookie('quantity_item'));
                map_cookie = new Map(Object.entries(cookie));

                if (!map_cookie.has(search_input)) {
                    map_cookie.set(search_input, getRandomIntInclusive(10, 199));

                    let objFromMap = Object.fromEntries(map_cookie);
                    let serialize_map_cookie = JSON.stringify(objFromMap);
                    cookieManager.setCookie('quantity_item', serialize_map_cookie, {'max-age': 3 * 3600});
                }
            }

            document.getElementById('search_response').innerHTML =
                'Поиск выполнен успешно, ' +
                document.getElementById('spare_part').value +
                ' в наличии на складе, в размере ' +
                map_cookie.get(search_input) + ' шт.';
        }
    }
}
new SearchForm();




