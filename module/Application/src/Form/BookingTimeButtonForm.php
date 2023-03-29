<?php

namespace Application\Form;

use Zend\Form\Form;

class BookingTimeButtonForm extends Form
{
    // Конструктор.
    public function __construct($bookingSlot, $today_or_tomorrow, $booking_msg_from_repair)
    {
        // Определяем имя формы
        parent::__construct('button-form-' . $today_or_tomorrow . '-' . $bookingSlot->getTime());

        // Задаем метод POST для этой формы
        $this->setAttribute('method', 'post');
        $this->setAttribute('action', '/#booking');

        // Добавляем элементы формы
        $this->addElements($bookingSlot, $booking_msg_from_repair);

        // Добавляем валидацию и фильтры
//        $this->addInputFilter();
    }

    // Этот метод добавляет элементы к форме (поля ввода и
    // кнопку отправки формы).
    private function addElements($bookingSlot, $booking_msg_from_repair)
    {
        $this->add([
            'type' => 'hidden',
            'name' => 'selected_booking_time',
            'attributes' => [
                'value' => $bookingSlot->getDate(),
            ],
        ]);
        $this->add([
            'type' => 'hidden',
            'name' => 'booking_msg_from_repair',
            'attributes' => [
                'value' => $booking_msg_from_repair,
            ],
        ]);


        // Добавляем кнопку отправки формы
        if ($bookingSlot->isAvailable()) {
            $button_color = 'btn btn-success';
            $disabled = '';
            $alt = 'Время для записи';
        } else {
            $button_color = 'btn btn-danger disabled';
            $disabled = 'true';
            $alt = 'Время недоступно';
        }
        $this->add([
            'type' => 'submit',
            'attributes' => [
                'id' => 'booking-form#booking',
                'disabled' => $disabled,
                'class' => $button_color,
                'value' => $bookingSlot->getTime(),
                'alt' => '$alt',
            ],
            'options' => [
                'alt' => $alt,
            ],
        ]);
    }
}