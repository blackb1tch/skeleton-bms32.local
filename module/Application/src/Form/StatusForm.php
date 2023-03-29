<?php

namespace Application\Form;

use Zend\Form\Form;

class StatusForm extends Form
{
    public function __construct()
    {
        // Определяем имя формы
        parent::__construct('response-form');

        // Задаем метод POST для этой формы
        $this->setAttribute('method', 'post');
//        $this->setAttribute('action', '/are-you-sure');


        // Добавляем элементы формы
        $this->addElements();

    }

    private function addElements()
    {
        $this->add([
            'type' => 'submit',
            'name' => 'confirm',
            'attributes' => [
                'class' => 'btn btn-success',
                'value' => 'Подтвердить',
            ],
        ]);

        $this->add([
            'type' => 'submit',
            'name' => 'reject',
            'attributes' => [
                'class' => 'btn btn-danger',
                'value' => 'Отклонить',
            ],
        ]);

        $this->add([
            'type' => 'hidden',
            'name' => 'booking_id',
        ]);

        $this->add([
            'type' => 'hidden',
            'name' => 'url',
        ]);

        $this->add([
            'type' => 'hidden',
            'name' => 'is_sure',
        ]);
    }

}