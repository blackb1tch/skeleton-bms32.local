<?php

namespace Application\Form;

use Zend\Form\Form;
use Zend\Validator\NotEmpty;

/**
 * Эта форма используется для сбора данных обратной связи с пользователем:
 * электронной почты, темы и текста.
 */
class RepairForm extends Form
{
    // Конструктор.
    public function __construct()
    {
        // Определяем имя формы
        parent::__construct('repair-form');

        // Задаем метод POST для этой формы
        $this->setAttribute('method', 'post');
//        $this->setAttribute('action', '/repair');

        // Добавляем элементы формы
        $this->addElements();

        // Добавляем валидацию и фильтры
        $this->addInputFilter();
    }

    // Этот метод добавляет элементы к форме (поля ввода и
    // кнопку отправки формы).
    private function addElements()
    {
        // Добавляем поле "запись на ремонт"
        $this->add([
            'type' => 'text',
            'name' => 'repair',
            'attributes' => [
                'id' => 'repair',
                'class' => 'form-control',
                'size' => '130',
                'placeholder' => 'Что нужно отремонтировать?'
            ],
            'options' => [
                'label' => 'Введите модель:',
            ],
        ]);
        // Добавляем кнопку отправки формы
        $this->add([
            'type' => 'submit',
            'name' => 'submit',
            'attributes' => [
                'class' => 'btn btn-primary',
                'value' => 'Поиск',
            ],
        ]);

    }

    private function addInputFilter()
    {
        // Используем стандартный InputFilter формы
        $inputFilter = $this->getInputFilter();

        $inputFilter->add([
            'name' => 'repair',
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
                        'message' =>'Наименование не может быть менее 2 символов!',
                    ],
                ],
                [
                    'name' => 'StringLength',
                    'options' => [
                        'max' => 75,
                        'message' =>'Наименование не может быть более 75 символов!',
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