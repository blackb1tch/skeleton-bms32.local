<?php

namespace Application\Form;

use Zend\Form\Form;
use Zend\Validator\NotEmpty;

class LoginForm extends Form
{
    // Конструктор.
    public function __construct()
    {
        // Определяем имя формы
        parent::__construct('auth-form');

        // Задаем метод POST для этой формы
        $this->setAttribute('method', 'post');

        // Добавляем элементы формы
        $this->addElements();

        // Добавляем валидацию и фильтры
        $this->addInputFilter();
    }

    // Этот метод добавляет элементы к форме (поля ввода и
    // кнопку отправки формы).
    private function addElements()
    {

        // Добавляем поле "login"
        $this->add([
            'type' => 'text',
            'name' => 'login',
            'attributes' => [
                'class' => 'form-control',
                'size' => '70',
                'placeholder' => 'user-Alex'
            ],
            'options' => [
                'label' => 'Логин:',
            ],
        ]);
        // Добавляем поле "pass"
        $this->add([
            'type' => 'password',
            'name' => 'password',
            'attributes' => [
                'class' => 'form-control',
                'size' => '70',
                'placeholder' => '*complex-password*'
            ],
            'options' => [
                'label' => 'Пароль:',
            ],
        ]);
        // Добавляем кнопку отправки формы
        $this->add([
            'type' => 'submit',
            'name' => 'submit',
            'attributes' => [
                'class' => 'btn btn-primary ',
                'value' => 'Войти',
            ],
        ]);

    }

    private function addInputFilter()
    {
        // Используем стандартный InputFilter формы
        $inputFilter = $this->getInputFilter();

        $inputFilter->add([
            'name' => 'login',
            'required' => true,
            'filters' => [
                ['name' => 'StringTrim'],
                ['name' => 'StripTags'],
                ['name' => 'StripNewlines'],
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
            ],
        ]);
        $inputFilter->add([
            'name' => 'password',
            'required' => true,
            'filters' => [
                ['name' => 'StringTrim'],
                ['name' => 'StripTags'],
                ['name' => 'StripNewlines'],
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
            ],
        ]);
    }
}