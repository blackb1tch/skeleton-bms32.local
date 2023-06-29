import MiddleControl from "./MiddleControl";
import SidebarControl from "./SidebarControl";

export default class PaginatorController {
    nav;
    router;
    count_pages;
    sidebarControl;
    middleControl;

    constructor(nav_dom_obj, router, count_pages) {
        this.nav = nav_dom_obj;
        this.router = router;
        this.count_pages = count_pages;

        this.sidebarControl = new SidebarControl(nav_dom_obj, router, count_pages);
        this.middleControl = new MiddleControl(nav_dom_obj, router, count_pages);
    }

    paginationAction() {
        let self = this;

        // очистка
        this.clearAction();

        // проверка на отображение панели пагинатора
        if (+this.count_pages > 1) {
            this.nav.className = 'enabled';
            this.sidebarControl.previousPage();
            this.middleControl. nearestPages();
            this.sidebarControl.nextPage();
            this.addActiveButton();
        } else {
            this.nav.className = 'disabled';
        }
    }

    addActiveButton() {
        let self = this;
        Array.from(this.nav.querySelector('div.middle').querySelectorAll('a')).forEach(function (button) {
            let page = self.router.routeExplode(self.router.getRoute());
            page = page['page'];
            if (+button.textContent === +page) {
                button.className = button.className + ' active';
            }
        });
    }

    clearAction() {
        let paginator = this.nav.querySelector('div.middle').querySelectorAll('a');

        for (let i = 0; i < paginator.length; i++) {
            paginator[i].remove()
        }
    }
}