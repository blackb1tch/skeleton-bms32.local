<?php

namespace Application\Form;

use Zend\Form\Form;
use Zend\Validator\NotEmpty;

class BookingForm extends Form

    /**
     * Эта форма используется для сбора данных обратной связи с пользователем:
     * электронной почты, темы и текста.
     */

{
    // Конструктор.
    public function __construct()
    {
        // Определяем имя формы
        parent::__construct('booking-form');

        // Задаем метод POST для этой формы
        $this->setAttribute('method', 'post');
        $this->setAttribute('action', '/booking-create#booking');

        // Добавляем элементы формы
        $this->addElements();

        // Добавляем валидацию и фильтры
        $this->addInputFilter();
    }

    // Этот метод добавляет элементы к форме (поля ввода и
    // кнопку отправки формы).
    private function addElements()
    {
        $this->add([
            'type' => 'text',
            'name' => 'disabled_booking_time',
            'attributes' => [
                'class' => 'disabled_booking_time',
                'readonly' => 'true',
                'size' => '20'
            ],
        ]);

        $this->add([
            'type' => 'hidden',
            'name' => 'hidden_booking_time',
            'attributes' => [
                'id' => 'input_hidden_time',
                'class' => 'form-control hidden_booking_time',
            ],
            'options' => [
                'label' => 'Время:',
            ],
        ]);

        $this->add([
            'type' => 'text',
            'name' => 'name',
            'attributes' => [
                'id' => 'input_name',
                'class' => 'form-control',
                'size' => '130',
                'placeholder' => 'Иванов Иван Иванович'
            ],
            'options' => [
                'label' => 'ФИО:',
            ],
        ]);

        $this->add([
            'type' => 'text',
            'name' => 'email',
            'attributes' => [
                'id' => 'input_email',
                'class' => 'form-control',
                'size' => '130',
                'placeholder' => 'email@example.com'
            ],
            'options' => [
                'label' => 'E-mail:',
            ],
        ]);

        $this->add([
            'type' => 'text',
            'name' => 'phone',
            'attributes' => [
                'id' => 'input_phone',
                'class' => 'form-control',
                'size' => '130',
                'placeholder' => '8-912-345-67-89'
            ],
            'options' => [
                'label' => 'Телефон:',
            ],
        ]);
        // Добавляем поле "запись на ремонт"
        $this->add([
            'type' => 'textarea',
            'name' => 'booking-msg',
            'attributes' => [
                'id' => 'input_booking-msg',
                'class' => 'form-control',
                'rows' => 6,
                'size' => '130',
                'placeholder' => 'Опишите, что нужно отремонтировать'
            ],
            'options' => [
                'label' => 'Описание:',
            ],
        ]);
        // Добавляем кнопку отправки формы
        $this->add([
            'type' => 'submit',
            'name' => 'submit',
            'attributes' => [
                'class' => 'btn btn-primary',
                'value' => 'Записаться',
            ],
        ]);

    }

    private function addInputFilter()
    {
        // Используем стандартный InputFilter формы
        $inputFilter = $this->getInputFilter();

        $inputFilter->add([
            'name' => 'disabled_booking_time',
            'required' => true,
            'filters' => [
                ['name' => 'StringTrim'],
            ],
            'validators' => [
                [
                    'name' => NotEmpty::class,
                    'options' => [
                        'messages' => [
                            NotEmpty::IS_EMPTY => 'Поле не может быть пустым!',
                        ],
                    ],
                ],
            ]
        ]);

        $inputFilter->add([
            'name' => 'hidden_booking_time',
            'required' => true,
            'filters' => [
                ['name' => 'StringTrim'],
            ],
            'validators' => [
                [
                    'name' => NotEmpty::class,
                    'options' => [
                        'messages' => [
                            NotEmpty::IS_EMPTY => 'Поле не может быть пустым!',
                        ],
                    ],
                ],
            ]
        ]);

        $inputFilter->add([
            'name' => 'name',
            'required' => true,
            'filters' => [
                ['name' => 'StringTrim'],
                ['name' => 'StripTags'],
                ['name' => 'StripNewlines'],
            ],
            'validators' => [
                [
                    'name' => 'StringLength',
                    'options' => [
                        'min' => 2,
                        'message' => 'Наименование не может быть менее 2 символов!',
                    ],
                ],
                [
                    'name' => 'StringLength',
                    'options' => [
                        'max' => 100,
                        'message' => 'Наименование не может быть более 100 символов!',
                    ],
                ],
//                [
//                    'name' => 'Regex',
//                    'options' => [
//                        'pattern' => '/[a-zA-Z]/i',
//                        'message' => 'Разрешены только латинские символы!'
//                    ],
//                ],
                [
                    'name' => NotEmpty::class,
                    'options' => [
                        'messages' => [
                            NotEmpty::IS_EMPTY => 'Поле не может быть пустым!',
                        ],
                    ],
                ],
            ],
        ]);

        $inputFilter->add([
            'name' => 'email',
            'required' => true,
            'filters' => [
                ['name' => 'StringTrim'],
            ],
            'validators' => [
                [
                    'name' => 'EmailAddress',
                    'options' => [
                        'allow' => \Zend\Validator\Hostname::ALLOW_DNS,
                        'useMxCheck' => false,
                        'message' => 'Введенный адрес электронной почты недействителен. Используйте базовый формат site@example.com'
                    ],
                ],
                [
                    'name' => 'StringLength',
                    'options' => [
                        'max' => 100,
                        'message' => 'Email не может быть более 100 символов!',
                    ],
                ],
                [
                    'name' => NotEmpty::class,
                    'options' => [
                        'messages' => [
                            NotEmpty::IS_EMPTY => 'Поле не может быть пустым!',
                        ],
                    ],
                ],
            ],
        ]);

        $inputFilter->add([
            'name' => 'phone',
            'required' => true,
            'filters' => [
            ],
            'validators' => [
                [
                    'name' => 'StringLength',
                    'options' => [
                        'min' => 2,
                        'message' => 'Телефон не может быть короче 10 символов!',
                    ],
                ],
                [
                    'name' => 'StringLength',
                    'options' => [
                        'max' => 20,
                        'message' => 'Телефон не может быть более 20 символов!',
                    ],
                ],
                [
                    'name' => NotEmpty::class,
                    'options' => [
                        'messages' => [
                            NotEmpty::IS_EMPTY => 'Поле не может быть пустым!',
                        ],
                    ],
                ],
            ],
        ]);
        $inputFilter->add([
            'name' => 'booking-msg',
            'required' => true,
            'filters' => [
                ['name' => 'StripTags'],
            ],
            'validators' => [
                [
                    'name' => 'StringLength',
                    'options' => [
                        'min' => 1,
                        'message' => 'Описание не может быть короче 1 символа!',
                    ],
                ],
                [
                    'name' => 'StringLength',
                    'options' => [
                        'max' => 4096,
                        'message' => 'Описание не может быть более 4096 символов!',
                    ],
                ],
                [
                    'name' => NotEmpty::class,
                    'options' => [
                        'messages' => [
                            NotEmpty::IS_EMPTY => 'Поле не может быть пустым!',
                        ],
                    ],
                ],
            ],
        ]);
    }
}