import PaginatorController from "./PaginatorController";

export default class Paginator {

    constructor(nav_dom_obj, router, count_pages) {
        let paginationController = new PaginatorController(nav_dom_obj, router, count_pages);
        paginationController.paginationAction();
    }

}