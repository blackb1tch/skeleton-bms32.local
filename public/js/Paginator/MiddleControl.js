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
        this.render();
        this.renderLeftDots();
        this.renderRightDots();
    }

    renderDigits() {
        // < …  4 5 6 7 8 …  >
        if (((this.current_page - 2) - this.first_page > 2) && (this.last_page - (this.current_page + 2) > 2)) {

            // вывод значений +-2 от текущего <1 …  4 5 6 7 8 … 11 >
            for (let page = this.current_page - 2; page < this.current_page + 3; page++) {
                this.addDigitHtml(this.route_obj, page);
            }
        } else {
            // <1 … 4 5 6 7 8 >
            if ((this.current_page - 2) - this.first_page > 2) {

                for (let page = this.current_page - 2; page < this.last_page + 1; page++) {
                    this.addDigitHtml(this.route_obj, page);
                    // добавить после

                }
            }
            // <1 2 3 4 5 6   … 11 >
            if (this.last_page - (this.current_page + 2) > 2) {
                for (let page = 1; page < this.current_page + 3; page++) {
                    this.addDigitHtml(this.route_obj, page);
                    // добавить перед
                }
            }

            // <1 2 3 4 5 6 7 8 >
            if ((!((this.current_page - 2) - this.first_page > 2) && !(this.last_page - (this.current_page + 2) > 2))) {
                for (let page = 1; page < this.last_page + 1; page++) {
                    this.addDigitHtml(this.route_obj, page);
                }
            }
        }
    }

    renderFirstPage() {
        // 1 выводится всегда
        this.addDigitHtml(this.route_obj, this.first_page);
    }

    renderLastPage() {

    }
    renderDigitsLeftPage(){

    }

    renderDigitsCurrentPage(){

    }
    renderDigitsRightPage(){

    }

    render() {

        // последняя выводится всегда
        if ((this.last_page !== this.current_page) && (this.first_page !== this.last_page)) {
            this.addDigitHtml(this.route_obj, this.last_page);
        }


        // если разница между текущей страницей и первой >=4
        // вывести
        if (((this.current_page - 2) - this.first_page > 2) && (this.last_page - (this.current_page + 2) > 2)) {
            console.log('render');
            for (let page = this.current_page - 2; page <= this.current_page + 2; page++) {
                this.addDigitHtml(this.route_obj, page);
                // добавить после

            }
        }
    }

    renderLeftDots() {
        // если разница между текущей страницей и первой >=4
        // вывести
        if ((this.current_page - this.first_page) >= 4) {
            console.log('current:', this.current_page, 'leftDots');

            this.addDotsHtml('left');
        }
    }

    renderRightDots() {
        // если разница между последней и текущей страницей >=4
        // вывести
        if ((this.last_page - this.current_page) >= 4) {
            console.log('current:', this.current_page, 'rightDots');
            this.addDotsHtml('right');
        }
    }

    addDigitHtml(route_obj, page) {
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