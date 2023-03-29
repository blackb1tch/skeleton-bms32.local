<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;
use Doctrine\ORM\Mapping\Driver\AnnotationDriver;

return [
    'router' => [
        'routes' => [
            'home' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action' => 'index',
                    ],
                ],
            ],
            'recordingSuccess' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/recording-success[/:time]',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action' => 'recordingSuccess',
                    ],
                ],
            ],
            'test' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/test',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action' => 'test',
                    ],
                ],
            ],
            'login' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/login',
                    'defaults' => [
                        'controller' => Controller\AuthController::class,
                        'action' => 'login',
                    ],
                ],
            ],
            'logout' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/logout',
                    'defaults' => [
                        'controller' => Controller\AuthController::class,
                        'action' => 'logout',
                    ],
                ],
            ],
            'areYouSure' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/are-you-sure',
                    'defaults' => [
                        'controller' => Controller\OperatorController::class,
                        'action' => 'areYouSure',
                    ],
                ],
            ],
            'panel' => [
                'type' => Segment::class,
                'options' => [
                    'route' => '/panel/booking',
                    'defaults' => [
                        'controller' => Controller\OperatorController::class,
                        'action' => 'index',
                    ],
                ],
            ],

            'doctrine' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/doctrine',
                    'defaults' => [
                        'controller' => Controller\DoctrineController::class,
                        'action' => 'doctrine',
                    ],
                ],
            ],
            'booking-create' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/booking-create',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action' => 'bookingCreate',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            Controller\DoctrineController::class => Controller\Factory\DoctrineControllerFactory::class,
            Controller\IndexController::class => Controller\Factory\IndexControllerFactory::class,
            Controller\AuthController::class => Controller\Factory\AuthControllerFactory::class,
            Controller\OperatorController::class => Controller\Factory\OperatorControllerFactory::class,
        ],
    ],
    'service_manager' => [
        'factories' => [
            Entity\Repositories\UserRepository::class => Entity\Repositories\Factory\AuthRepositoryFactory::class,
//            Entity\Repositories\BookingRepository::class => Entity\Repositories\Factory\BookingRepositoryFactory::class,
            Service\UserManager::class => Service\Factory\UserManagerFactory::class,
            Service\BookingManager::class => Service\Factory\BookingManagerFactory::class,
            Service\EntityManager::class => Service\Factory\EntityManagerFactory::class,
            Service\MailManager::class => Service\Factory\MailManagerFactory::class,
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions' => true,
        'doctype' => 'HTML5',
        'not_found_template' => 'error/404',
        'exception_template' => 'error/index',
        'template_map' => [
            'layout/layout' => __DIR__ . '/../view/layout/layout.phtml',
            'ModuleApiV1/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404' => __DIR__ . '/../view/error/404.phtml',
            'error/index' => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
        'strategies' => [
            'ViewJsonStrategy',
        ],
    ],
    'DB' => [
        'url' => 'localhost',
        'username' => 'root',
        'password' => '',
        'dbname' => 'bms32'
    ],
    'doctrine' => [
        'driver' => [
            __NAMESPACE__ . '_driver' => [
                'class' => AnnotationDriver::class,
                'cache' => 'array',
                'paths' => [__DIR__ . '/../src/Entity']
            ],
            'orm_default' => [
                'drivers' => [
                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver'
                ]
            ]
        ],

    ],
    'mail' => [
        'name' => 'localhost',
        'host' => 'smtp.yandex.ru',
        'port' => 465,
        'connection_class' => 'login',
        'connection_config' => [
            'username' => 'gtgodz1ll@yandex.ru',
            'password' => 'Dhn7q-90nqAs',
            'ssl' => 'ssl'
        ],
    ],
];
