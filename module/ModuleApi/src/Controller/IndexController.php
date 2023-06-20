<?php

namespace ModuleApi\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class IndexController extends AbstractActionController
{
    private $bookingManager;

    public function __construct($bookingManager)
    {
        $this->bookingManager = $bookingManager;
    }


    /** Возвращает JSON слоты времени для booking, на сегодня и завтра
     * @return JsonModel
     */
    public function notBookedTimeAction()
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
                'response' => 'OK',
                'time_slots' => $bookingTimeButtons,
            ]);
        } catch (\Exception $e){
            return new JsonModel([
               'response' => 'error',
               'message' => $e->getMessage(),
            ]);

        }
    }
}