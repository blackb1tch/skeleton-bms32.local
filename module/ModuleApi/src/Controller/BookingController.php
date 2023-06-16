<?php

namespace ModuleApi\Controller;

use Application\Form\BookingForm;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class BookingController extends AbstractActionController
{

    private $bookingManager;
    private $sessionContainer;

    public function __construct($bookingManager, /* $mailManager, */ $sessionContainer)
    {
        $this->bookingManager = $bookingManager;
        $this->sessionContainer = $sessionContainer;
    }

    /** принять данные JSON, валидировать и записать в бд
     *  отобразить темплейт с временем и ID заявки
     * @return JsonModel
     */
    public function createAction()
    {
        $json_booking_data = $this->getRequest()->getContent();
        if (!empty($json_booking_data)) {
            $json_booking_data = json_decode($json_booking_data, true);
        } else {
            $json_booking_data = [];
        }
        //форма "оставить заявку на ремонт"
        $bookingForm = new BookingForm();
        $bookingForm->setData($json_booking_data);

        if ($bookingForm->isValid()) {

            try {
                $booking_id = $this->bookingManager->addBooking($json_booking_data);

                return new JsonModel([
                    'response' => 'OK',
                    'booking_time' => $json_booking_data['disabled_booking_time'],
                    'booking_id' => $booking_id,
                ]);
            } catch (\Exception $e) {
                return new JsonModel([
                    'response' => 'error',
                    'message' => $e->getMessage()
                ]);
            }
        }
        return new JsonModel([
            'response' => 'exception',
            'message' => 'Данные введены не корректно!'// поле с ошибкой,
        ]);
    }

    public function listAction()

    {


        if ($this->sessionContainer->loggedIn) {
//            $json_data = $this->getRequest()->getContent();
//            $json_data = json_decode($json_data, true);

            $params = $this->params()->fromRoute();
            if (empty($params['search-by-id-or-phone-or-name-or-email'])) {
                $params['search-by-id-or-phone-or-name-or-email'] = null;
                $params['word'] = null;
            }
            if (empty($params['date'])) {
                $params['date'] = null;
                $params['from'] = null;
                $params['to'] = null;
            }
            try {
                $params['status'] = $params['boolean-or-is_null'];
                $params['sort-by'] = $params['sort-by-id-or-phone-or-name-or-email'];
//                $params['asc-or-desc'] = $params['asc-or-desc'];
                $params['search-by'] = $params['search-by-id-or-phone-or-name-or-email'];
                $params['search-word'] = $params['word'];
                $params['date-or-create-date'] = $params['date'];
                $params['date-from'] = $params['from'];
                $params['date-to'] = $params['to'];


                $pageArray = $this->bookingManager->getPage($params);

            } catch (\Exception $e) {
                return new JsonModel([
                    'response' => 'error',
                    'message' => $e->getMessage(),
                ]);
            }

            return new JsonModel([
                'response' => 'OK',
                'page-array' => $pageArray,
            ]);
        }
        // 403

    }

    public function approveAction()
    {

        if ($this->sessionContainer->loggedIn) {
            $id = $this->params()->fromRoute('id', 0);
            $status = 'approve';

            $status_data = [
                'status' => $status,
                'booking_id' => $id,
            ];

            try {
                $this->bookingManager->updateStatus($status_data);
            } catch (\Exception $e) {

                return new JsonModel([
                    'status' => $status,
                    'response' => 'error',
                    'message' => $e->getMessage(),
                ]);
            }


            return new JsonModel([
                'response' => 'success',
                'status' => $status,
                'id' => $id,
            ]);
        }
        // 403
    }

    public function declineAction()
    {
        if ($this->sessionContainer->loggedIn) {
            $id = $this->params()->fromRoute('id', 0);
            $status = 'decline';

            $status_data = [
                'status' => $status,
                'booking_id' => $id,
            ];

            try {
                $this->bookingManager->updateStatus($status_data);
            } catch (\Exception $e) {

                return new JsonModel([
                    'status' => $status,
                    'response' => 'error',
                    'message' => $e->getMessage(),
                ]);
            }

            return new JsonModel([
                'response' => 'success',
                'status' => $status,
                'id' => $id,
            ]);
        }
        // 403
    }

    public function editAction()
    {
        if ($this->sessionContainer->loggedIn) {
            $json_booking_data = $this->getRequest()->getContent();

            if (!empty($json_booking_data)) {
                $json_booking_data = json_decode($json_booking_data, true);
            } else {
                $json_booking_data = [];
            }

            //форма "оставить заявку на ремонт"
            $bookingForm = new BookingForm();
            $bookingForm->setData($json_booking_data);

            if ($bookingForm->isValid()) {
                try {
                    // update
                    $this->bookingManager->updateBookingById($json_booking_data);

                    return new JsonModel([
                        'response' => 'success',
                        'status' => '$status'
                    ]);
                } catch (\Exception $e) {
                    return new JsonModel([
                        'response' => 'error',
                        'message' => $e->getMessage()
                    ]);
                }
            }
            return new JsonModel([
                'response' => 'exception',
                'message' => 'Данные введены некорректно!'// поле с ошибкой,
            ]);
        }
    }

    public function deleteAction()
    {
        if ($this->sessionContainer->loggedIn) {
            $id = $this->params()->fromRoute('id', 0);
            try {
                $this->bookingManager->deleteBookingById($id);
            } catch (\Exception $e) {

                return new JsonModel([
                    'response' => 'error',
                    'message' => $e->getMessage(),
                ]);
            }


            return new JsonModel([
                'response' => 'success',
                'id' => $id,
            ]);
        }
        // 403
    }
}