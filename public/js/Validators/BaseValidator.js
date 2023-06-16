export default class BaseValidator {

    checkParams(default_params = {}, params = {}) {
        for (let param in default_params) {
           if (!params.hasOwnProperty(param)){
               throw new Error('Отсутствует параметр '+ param);
           }
           if (typeof(params[param]) !== default_params[param]){
               throw new Error('Параметр '+ param + ' ожидается ' + default_params[param] + ', получено: ' + params[param]);
           }
        }
    }
}