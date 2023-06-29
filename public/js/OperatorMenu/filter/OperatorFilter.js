import ControlsList from "./ControlsList";
import OperatorMenu from "../OperatorMenu";
import Router from "../Router";

class OperatorFilter {
    router = new Router();
    operatorMenu = new OperatorMenu(this.router);

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
                // route = route + '/page/1/limit/5';
                route = route + '/page/' + self.router.getPage() + '/limit/'+ self.router.getLimit();

                if (self.router.getRoute() !== route) {
                    // кеш роута
                    self.router.setRoute(route) ;

                    // передать данные в класс меню
                    self.operatorMenu.clearPage();
                    self.operatorMenu.getList(route);
                }
            }
        }
        document.querySelector('#reset-btn').onclick = function (event) {
            let target = event.target;
            if (target.tagName === 'INPUT') {
                if (self.router.getRoute() !== self.router.default_route){
                    self.router.setRoute(self.router.default_route);

                    self.operatorMenu.clearPage();
                    self.operatorMenu.getList(self.router.getRoute());
                }
            }
        }
    }
}

new OperatorFilter()