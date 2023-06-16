import SearchByDateControl from './SearchByDateControl';
import SearchControl from './SearchControl';
import SortByIdControl from './SortByIdControl';
import SortByStatusControl from './SortByStatusControl';

export default class ControlsList {
    getList() {
        return {
            'SortByStatusControl': new SortByStatusControl(),
            'SortByBookingControl': new SortByIdControl(),
            'SearchControl': new SearchControl(),
            'SearchByDateControl': new SearchByDateControl()
        }
    }
}