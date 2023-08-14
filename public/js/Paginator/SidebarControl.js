export default class SidebarControl {
    previous_btn_a;
    next_btn_a;
    nav;
    route_obj;
    count_pages;

    constructor(nav_obj, router, count_pages) {
        this.nav = nav_obj;
        this.previous_btn_a = this.nav.querySelector('div.previous-button').querySelector('a');
        this.next_btn_a = this.nav.querySelector('div.next-button').querySelector('a');

        this.router = router;
        this.route_obj = this.router.routeExplode(this.router.getRoute());
        this.count_pages = +count_pages;
    }

    firstPage() {
        let current_page = +this.route_obj['page'];
        // проверить, можно ли перейти на предидущую страницу
        if (+this.route_obj['page'] - 1 !== 0) {
            // перейти возможно

            // изменить номер страницы в роуте

            this.route_obj['page'] = 1;

            // добавление роута для перехода на 1 страницу
            this.previous_btn_a.name = this.router.makeRoute(this.route_obj);
            this.previous_btn_a.title = 'Перейти к первой странице';

            // вернуть номер текущей страницы в роут
            this.route_obj['page'] = current_page;
            this.previous_btn_a.className = 'enabled';
        } else {
            // перейти невозможно
            this.previous_btn_a.className = 'disabled';
        }
        if (current_page < 6) {
            this.previous_btn_a.className = 'disabled';
        }
    }

    lastPage() {
        let current_page = +this.route_obj['page'];
        // проверить, можно ли перейти на следующую страницу
        if (+this.route_obj['page'] + 1 >= +this.count_pages) {
            // перейти невозможно
            this.next_btn_a.className = 'disabled';
        } else {
            // перейти возможно
            this.route_obj['page'] = this.count_pages;

            // добавление роута для перехода на следующую страницу
            this.next_btn_a.name = this.router.makeRoute(this.route_obj);
            this.next_btn_a.title = 'Перейти к последней странице ('+ this.count_pages + ')';

            // вернуть номер текущей страницы в роут
            this.route_obj['page'] = current_page;
            this.next_btn_a.className = 'enabled';
        }
        if (this.count_pages - current_page < 5) {
            this.next_btn_a.className = 'disabled';
        }
    }
}