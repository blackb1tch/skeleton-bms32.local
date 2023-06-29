export default class MiddleControl {
    nav;
    middle;
    a;
    router;
    first_page;
    current_page
    last_page;
    route_obj;

    constructor(nav_dom_obj, router, count_pages) {
        this.middle = nav_dom_obj.querySelector('div.middle');
        this.a = document.createElement('a');

        this.router = router;
        this.route_obj = this.router.routeExplode(this.router.getRoute());
        this.first_page = 1;
        this.current_page = +this.route_obj['page'];
        this.last_page = +count_pages;

    }

    nearestPages() {
        this.numbers();
        this.dots();
    }

    numbers() {
        // <1 …  4 5 6 7 8 … 11 >
        if (((this.current_page - 2) - this.first_page > 2) && (this.last_page - (this.current_page + 2) > 2)) {

            // вывод значений +-2 от текущего <1 …  4 5 6 7 8 … 11 >
            for (let page = this.current_page - 2; page < this.current_page + 3; page++) {
                this.addHtml(this.route_obj, page);
            }
        } else {
            // <1 … 4 5 6 7 8 >
            if ((this.current_page - 2) - this.first_page > 2) {

                for (let page = this.current_page - 2; page < this.last_page + 1; page++) {
                    this.addHtml(this.route_obj, page);
                    // добавить после

                }
            }
            // <1 2 3 4 5 6   … 11 >
            if (this.last_page - (this.current_page + 2) > 2) {
                for (let page = 1; page < this.current_page + 3; page++) {
                    this.addHtml(this.route_obj, page);
                    // добавить перед
                }
            }

            // <1 2 3 4 5 6 7 8 >
            if ((!((this.current_page - 2) - this.first_page > 2) && !(this.last_page - (this.current_page + 2) > 2))) {
                for (let page = 1; page < this.last_page + 1; page++) {
                    this.addHtml(this.route_obj, page);
                }
            }
        }
    }

    dots() {
        // если разница между первой/последней и +-2 страницы от текущей больше 2
        if ((!((this.current_page - 2) - this.first_page > 2) && !(this.last_page - (this.current_page + 2) > 2))) {
            // не выводить ничего
        } else {
            // если текущая +-2 больше первой/последней страницы более чем на 2 страницы
            if ((this.current_page > 5) && (this.last_page - this.current_page > 4)) {
                // вывести с обеих сторон
                this.addDotsHtml('left');
                this.addDotsHtml('right');
            } else {
                // если текущая -2 больше первой страницы более чем на 2 страницы
                if ((this.current_page - 2) - this.first_page > 2) {
                    // <1 … 4 5 6 7 8 >
                    // вывести слева
                    this.addDotsHtml('left');
                } else {
                    // <1 2 3 4 5 6 … 11 >
                    // вывести справа
                    this.addDotsHtml('right');
                }
            }
        }
    }

    addHtml(route_obj, page) {
        route_obj['page'] = page;
        let local_a = this.a.cloneNode(true);
        local_a.innerHTML = page;
        local_a.className = 'enabled';
        local_a.name = this.router.makeRoute(route_obj);
        this.middle.append(local_a);
    }

    addDotsHtml(left_or_right) {
        let local_a = this.a.cloneNode(true);
        local_a.innerHTML = '...';
        local_a.className = 'disabled';
        switch (left_or_right) {
            case ('right'):
                this.middle.append(local_a);
                break;
            case ('left'):
                this.middle.prepend(local_a);
                break;
        }
    }
}