import ControlsList from "./ControlsList";
import OperatorMenu from "../OperatorMenu";
import Router from "../Router";

class OperatorFilter {
    cache_route = '/is-approved/null/sort-by/id/asc-or-desc/desc/page/1/limit/5';
    default_route = '/is-approved/null/sort-by/id/asc-or-desc/desc/page/1/limit/5';
    router = new Router();
    operatorMenu = new OperatorMenu(this.cache_route);

    constructor() {
        let filter_control = document.querySelector('#filter-control');
        let self = this;

        document.querySelector('.filter').oninput = function (event) {
            let target = event.target;

            let controlsList = new ControlsList();
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
                    self.cache_route = route

                    self.operatorMenu.setRoute( self.cache_route);
                    // передать данные на сервер
                    self.operatorMenu.clearPage();
                    self.operatorMenu.getList(route);
                }
            }
        }
        document.querySelector('#reset-btn').onclick = function (event) {
            let target = event.target;
            if (target.tagName === 'INPUT') {
                if (self.cache_route !== self.default_route){
                    self.cache_route = self.default_route;

                    self.operatorMenu.clearPage();
                    self.operatorMenu.getList(self.default_route);
                }
            }
        }
    }
}

new OperatorFilter()