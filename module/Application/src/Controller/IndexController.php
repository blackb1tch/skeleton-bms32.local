<?php

namespace Application\Controller;

use Application\Form\{BookingForm, BookingTimeButtonForm, RepairForm, SearchForm, TestForm};
use Application\Middleware\CookieManager;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;


class IndexController extends AbstractActionController
{
    private $bookingManager;


    public function __construct($bookingManager)
    {
        $this->bookingManager = $bookingManager;
    }

    public function indexAction()
    {
        $searchForm = new SearchForm();
        $repairForm = new RepairForm();
        $bookingForm = new BookingForm();
        $cookieManager = new CookieManager($this->getRequest(), $this->getResponse());

        $form_response = null;
        $bookingTimeButtons = null;

        // видимость формы "оставить заявку на ремонт"
        $booking_form_is_visible = false;

        // видимость кнопок времени записи
        $booking_time_buttons_is_visible = false;

        if ($this->getRequest()->isPost()) {

            // извлечение данных из форм
            $data = $this->params()->fromPost();
            if (empty($data)) {

                $data = ($this->getRequest()->getContent());
                $data = json_decode($data, true);
            }

            //форма поиска запчасти по каталогу
            if (isset($data['spare_parts'])) {
                $searchForm->setData($data);

                if ($searchForm->isValid()) {
                    $form_response = [
                        'form' => 'search-form',
                        'data' => $data['spare_parts'],
                        'param' => $cookieManager->getRandomItem($data['spare_parts'])
                    ];
                }
            }

            // форма "выполняем ремонт"
            if (isset($data['repair'])) {
                $repairForm->setData($data);

                if ($repairForm->isValid()) {
                    $booking_time_buttons_is_visible = true;

                    //Действия с данными
                    $form_response = [
                        'form' => 'repair-form',
                        'data' => $data['repair'],
                    ];
                }
            }

            //если время заявки выбрано
            if (isset($data['selected_booking_time'])) {

                // подстановка выбранного времени в форму заявки на ремонт в скрытое поле для передачи далее
                $bookingForm->get('hidden_booking_time')->setValue($data['selected_booking_time']);
                // отображение кирилического дня недели и времени для пользователя в форме
                $bookingForm
                    ->get('disabled_booking_time')
                    ->setValue($this->bookingManager->dayTranslate($data['selected_booking_time'])
                        . date(', H:i ', strtotime($data['selected_booking_time'])
                        )
                    );
                // подстановка сообщения из формы "выполняем ремонт", в форму заявки на ремонт в поле сообщения для удобства пользователя
                $bookingForm->get('booking-msg')->setValue($data['booking_msg_from_repair']);

                $booking_form_is_visible = true;
                $booking_time_buttons_is_visible = true;
            }
        }

        if ($booking_time_buttons_is_visible) {

            // получаем сегодняшнюю дату
            $today_date = date('Y-m-d');

            // получаем все временные слоты на сегодня
            $today_booking_time_slots = $this->bookingManager->getBookingTimeSlots($today_date);

            $booking_msg_from_repair = '';
            if (isset($data['repair'])) {
                $booking_msg_from_repair = $data['repair'];
            }
            if (isset($data['selected_booking_time'])) {
                $booking_msg_from_repair = $data['booking_msg_from_repair'];
            }
            foreach ($today_booking_time_slots as $key => $bookingSlot) {
                if ($this->getRequest()->isXmlHttpRequest()) {
                    $bookingTimeButtons['today'][] = $bookingSlot->getTime();
                } else {
                    $bookingTimeButtons['today'][] = new BookingTimeButtonForm($bookingSlot, 'today', $booking_msg_from_repair);
                }
            }

            // получаем завтрашнюю дату
            $tomorrow_date = date('Y-m-d', strtotime($today_date . ' +1 day'));

            // получаем массив доступного и не доступного времени для записи на завтра
            $tomorrow_booking_time_slots = $this->bookingManager->getBookingTimeSlots($tomorrow_date);

            foreach ($tomorrow_booking_time_slots as $key => $bookingSlot) {
                if ($this->getRequest()->isXmlHttpRequest()) {
                    $bookingTimeButtons['tomorrow'][] = $bookingSlot->getTime();
                } else {
                    $bookingTimeButtons['tomorrow'][] = new BookingTimeButtonForm($bookingSlot, 'tomorrow', $booking_msg_from_repair);
                }
            }
        }
        if ($this->getRequest()->isXmlHttpRequest()) {

            return new JsonModel([
                'form_response' => $form_response,
//                'booking_time_buttons_is_visible' => $booking_time_buttons_is_visible,
//                'bookingTimeButtons' => $bookingTimeButtons,
//                'booking_form_is_visible' => $booking_form_is_visible,
            ]);
        }
        return new ViewModel([
            'repairForm' => $repairForm,
            'searchForm' => $searchForm,
            'form_response' => $form_response,
            'booking_time_buttons_is_visible' => $booking_time_buttons_is_visible,
            'bookingTimeButtons' => $bookingTimeButtons,
            'booking_form_is_visible' => $booking_form_is_visible,
            'bookingForm' => $bookingForm,
        ]);
    }

    //экшен для обработки записи
    public function bookingCreateAction()
    {
        //отрисовываем форму если не пост, или если ошибка
        $bookingForm = new BookingForm();
        $cookieManager = new CookieManager($this->getRequest(), $this->getResponse());

        if ($this->getRequest()->isPost()) {

            // извлечение данных из форм
            $data = $this->params()->fromPost();
            if (empty($data)) {
                $data = ($this->getRequest()->getContent());
                $data = json_decode($data, true);
            }
            //форма "оставить заявку на ремонт"

            $bookingForm->setData($data);
            $day_in_russian = $this->bookingManager->dayTranslate($data['hidden_booking_time']);
            $bookingForm->get('disabled_booking_time')->setValue($day_in_russian . date(', H:i ', strtotime($data['hidden_booking_time'])));
            $bookingForm->get('booking-msg')->setValue($cookieManager->getRepairMsg());

            if ($bookingForm->isValid()) {

                try {
                    $booking_id = $this->bookingManager->addBooking($data);
                } catch (\Exception $e) {

                    $viewModel = new ViewModel([
                        'error_message' => $e->getMessage(),
                    ]);
                    $viewModel->setTemplate('error/exception-error');
                    return $viewModel;
                }

                // страница "заявка принята"
                if ($this->getRequest()->isXmlHttpRequest()) {

                    return new JsonModel([
                        'booking_id' => $booking_id,
                    ]);
                } else {
                    return $this->redirect()->toRoute('recordingSuccess',
                        [
                            'controller' => 'index',
                            'action' => 'recordingSuccess',
                            'time' => $data['hidden_booking_time'],
                        ]);
                }
            }

            $bookingForm->get('booking-msg')->setValue($data['booking-msg']);
        }
        $viewModel = new ViewModel([
            'bookingForm' => $bookingForm,
        ]);
        $viewModel->setTemplate('application/index/booking-form');

        return $viewModel;
    }

    public function recordingSuccessAction()
    {
        $booking_time = $this->params()->fromRoute('time');
        if (isset($booking_time)) {

            return new ViewModel([
                'booking_time' => $booking_time,
            ]);
        }

        return $this->notFoundAction();
    }


    public function testAction()
    {
        // Create Contact Us form
        $form = new TestForm();

        // Check if user has submitted the form
        if ($this->getRequest()->isPost()) {

            // Fill in the form with POST data
            $data = $this->params()->fromPost();

            $form->setData($data);

            // Validate form
            if ($form->isValid()) {

                // Get filtered and validated data
                $data = $form->getData();
                $email = $data['email'];
                $subject = $data['subject'];
                $body = $data['body'];


                // Redirect to "Thank You" page
                return $this->redirect()->toRoute('Application',
                    ['action' => 'tou']);
            }
        }

        // Pass form variable to view
        return new ViewModel([
            'form' => $form
        ]);
    }

}
