export default class Router {
    default_route_obj = {};
    cached_route;

    getRoute() {
        return this.cached_route;
    }
    setRoute(route){
        this.cached_route = route;
    }
    setCookieRoute(){

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