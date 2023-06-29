export default class Router {
    default_route;
    cached_route;
    page = 1;
    limit = 2;

    constructor() {

        this.default_route = '/is-approved/null/sort-by/id/asc-or-desc/desc/page/' + this.getPage() + '/limit/' + this.getLimit();
        this.cached_route = this.default_route;
    }

    setRoute(route) {
        this.cached_route = route;

    }

    setPage(page) {
        this.page = page;
    }

    setLimit(limit) {
        console.log('router-lim:', limit);
        this.limit = limit;
        let route = this.routeExplode(this.getRoute());
        route['limit'] = limit;
        this.setRoute(this.makeRoute(route));
    }

    setCookieRoute() {

    }

    getRoute() {
        return this.cached_route;
    }

    getPage() {
        return this.page;
    }

    getLimit() {
        return this.limit;
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
}