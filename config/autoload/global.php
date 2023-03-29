<?php
/**
 * Global Configuration Override
 *
 * You can use this file for overriding configuration values from modules, etc.
 * You would place values in here that are agnostic to the environment and not
 * sensitive to security.
 *
 * @NOTE: In practice, this file will typically be INCLUDED in your source
 * control, so do not include passwords or other sensitive information in this
 * file.
 */

use Zend\Session\Storage\SessionArrayStorage;
use Zend\Session\Validator\HttpUserAgent;
use Zend\Session\Validator\RemoteAddr;

return [
    // Настройка хранилища сессий.
    'session_storage' => [
        'type' => SessionArrayStorage::class
    ],
    // Настройка менеджера сессий.
    'session_manager' => [
        'config' => [
            // Настройка сессии.
            'class' => Session\Config\SessionConfig::class,
            'options' => [
                // Срок действия cookie сессии истечет через 1 час.
                'cookie_lifetime' => 60*1,
                // Данные сессии будут храниться на сервере до 30 дней.
                'gc_maxlifetime'     => 60*60*24*30,
                'name' => 'myapp',
            ],
        ],
        'storage' => Session\Storage\SessionArrayStorage::class,
        'validators' => [
            Session\Validator\RemoteAddr::class,
            Session\Validator\HttpUserAgent::class,
        ],
    ],
    'doctrine' => [
        // migrations configuration
        'migrations_configuration' => [
            'orm_default' => [
                'directory' => 'data/Migrations',
                'name'      => 'Doctrine Database Migrations',
                'namespace' => 'Migrations',
                'table'     => 'migrations',
            ],
        ],
    ],
];
