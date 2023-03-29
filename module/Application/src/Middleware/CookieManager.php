<?php

namespace Application\Middleware;

use Zend\Http\Header\SetCookie;

class CookieManager
{
    private $response;
    private $request;

    public function __construct($request, $response)
    {
        $this->request = $request;
        $this->response = $response;
    }

    public function getRandomItem($item)
    {
        if (isset($this->request->getCookie()['quantity-item'])) {
            $cookieItem = unserialize($this->request->getCookie()['quantity-item']);
            $newCookie = $cookieItem;
        }
        if (isset($cookieItem[$item])) {

            return $cookieItem[$item];
        }


        $newCookie[$item] = $rand = rand(10, 199);
        $cookie = new SetCookie('quantity-item', serialize($newCookie), time() + 60 * 60 * 3, '/');
        $this->response->getHeaders()->addHeader($cookie);

        return $rand;
    }

    /** Сохранение, возврат сообщения пользователя в форме "выполняем ремонт" в куки
     * @param $repair_msg
     * @return bool|mixed
     * @throws \Exception
     */
    public function getRepairMsg()
    {

        try {
            if (isset($this->request->getCookie()['repair_msg'])) {

                return unserialize($this->request->getCookie()['repair_msg']);
            }
        } catch (\Exception $e) {
            throw new \Exception('Ошибка извлечения Cookie');
        }

    }

    public function setRepairMsg($repair_msg)
    {
        try {
            $repair_msg_cookie = new SetCookie('repair_msg', serialize($repair_msg), time() + 60 * 5, '/');
            $this->response->getHeaders()->addHeader($repair_msg_cookie);
            return true;
        } catch (\Exception $e) {
            throw new \Exception('Ошибка добавления Cookie');
        }
    }


}