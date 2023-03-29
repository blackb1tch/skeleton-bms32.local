<?php

namespace ModuleApi\Controller;

use ModuleApi\Form\BookingForm;
use ModuleApi\Form\BookingTimeButtonForm;
use ModuleApi\Form\RepairForm;
use ModuleApi\Form\SearchForm;
use ModuleApi\Middleware\CookieManager;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zend\View\View;

class IndexController extends AbstractActionController
{
    private $bookingManager;

    public function __construct($bookingManager)
    {
        $this->bookingManager = $bookingManager;
    }

//    public function indexAction()
//    {
//        $searchForm = new SearchForm();
//        $repairForm = new RepairForm();
//
//        return new ViewModel([
//            'repairForm' => $repairForm,
//            'searchForm' => $searchForm,
//        ]);
//    }

    /** принять данные JSON, валидировать и записать в бд
     *  отобразить темплейт с временем и ID заявки
     * @return JsonModel
     */
    public function createBookingAction()
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
                    'status' => 'OK',
                    'booking_time' => $json_booking_data['disabled_booking_time'],
                    'booking_id' => $booking_id,
                ]);
            } catch (\Exception $e) {
                return new JsonModel([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ]);
            }
        }
        return new JsonModel([
            'status' => 'exception',
            'message' => 'Данные введены не корректно!'// поле с ошибкой,
        ]);
    }
//
//    /** Возвращает форму booking
//     * @return ViewModel
//     */
//    public function readBookingAction()
//    {
//        $bookingForm = new BookingForm();
//
//        $viewModel = new ViewModel([
//            'bookingForm' => $bookingForm,
//        ]);
//        $viewModel->setTemplate('module-api/index/booking-form');
//        return $viewModel;
//    }


    /** Возвращает JSON слоты времени для booking, на сегодня и завтра
     * @return JsonModel
     */
    public function timeSlotsAction()
    {
        // получаем сегодняшнюю дату
        $today_date = date('Y-m-d');

        // получаем все временные слоты на сегодня
        try {
            $today_booking_time_slots = $this->bookingManager->getBookingTimeSlots($today_date);

            foreach ($today_booking_time_slots as $key => $bookingSlot) {
                $bookingTimeButtons['today'][$bookingSlot->getTime()] = [
                    'time' => $bookingSlot->getTime(),
                    'date' => $bookingSlot->getDate(),
                    'is_available' => $bookingSlot->isAvailable(),
                ];
            }

            // получаем завтрашнюю дату
            $tomorrow_date = date('Y-m-d', strtotime($today_date . ' +1 day'));

            // получаем массив доступного и не доступного времени для записи на завтра
            $tomorrow_booking_time_slots = $this->bookingManager->getBookingTimeSlots($tomorrow_date);

            foreach ($tomorrow_booking_time_slots as $key => $bookingSlot) {
                $bookingTimeButtons['tomorrow'][$bookingSlot->getTime()] = [
                    'time' => $bookingSlot->getTime(),
                    'date' => $bookingSlot->getDate(),
                    'is_available' => $bookingSlot->isAvailable(),
                ];
            }

            return new JsonModel([
                'status' => 'OK',
                'time_slots' => $bookingTimeButtons,
            ]);
        } catch (\Exception $e){
            return new JsonModel([
               'status' => 'error',
               'message' => $e->getMessage(),
            ]);

        }
    }
}