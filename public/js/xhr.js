export default class myXmlHttpRequest {

    constructor(method, json_request, url = '/', async = true) {
        this.method = method;
        this.url = url;
        this.async = async;
        this.json_request = json_request;
        // this.json_response;
        this.xhr = new XMLHttpRequest();
    }

    getXhr() {
        return new Promise((resolve, reject) => {
            this.xhr.open(this.method, this.url, this.async);
            this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            this.xhr.onload = () => {
                if (this.xhr.status === 200) {

                    resolve(this.xhr.response);
                } else {
                    reject(new Error(`${this.xhr.status}: Адрес запроса не найден!`));
                }
            };
            this.xhr.onerror = () => {
                reject(new Error(`Ошибка! Не удалось отправить запрос!`));
            };

            this.xhr.send(this.json_request);
        });
    }

}
