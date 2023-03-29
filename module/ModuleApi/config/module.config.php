<?php

namespace ModuleApi;

use Doctrine\ORM\Mapping\Driver\AnnotationDriver;
use Zend\Router\Http\Literal;
use Zend\Router\Http\Method;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;

return [
    'router' => [
        'routes' => [
            'api' => [
                'type' => Literal::class,
                'options' => [
                    'route' => '/api',
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'home-page' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/',
                            'defaults' => [
                                'controller' => Controller\IndexController::class,
                                'action' => 'index',
                            ],
                        ],
                    ],
                    'booking' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/booking',
                            'defaults' => [
                                'controller' => Controller\IndexController::class
                            ],
                        ],
                        'may_terminate' => false,
                        'child_routes' => [
                            'create-booking' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'POST',
                                    'defaults' => [
                                        'controller' => Controller\IndexController::class,
                                        'action' => 'createBooking',
                                    ],
                                ],
                            ],
                            'list-booking' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'GET',
                                    'defaults' => [
                                        'controller' => Controller\OperatorController::class,
                                        'action' => 'BookingList',
                                    ],
                                ],
                            ],
                            'update-booking' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'PUT',
                                    'route' => '[/:id]',
                                    'defaults' => [
                                        'controller' => Controller\OperatorController::class,
                                        'action' => 'updateBooking',
                                    ],
                                ],
                            ],
                            'delete-booking' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'DELETE',
                                    'route' => '[/:id]',
                                    'defaults' => [
                                        'controller' => Controller\OperatorController::class,
                                        'action' => 'deleteBooking',
                                    ],
                                ],
                            ],
                        ],
                    ],

                    'timeslots' => [
                        'type' => Literal::class,
                        'may_terminate' => true,
                        'options' => [
                            'route' => '/time-slots',
                            'defaults' => [
                                'controller' => Controller\IndexController::class,
                                'action' => 'timeSlots',
                            ],
                        ],
                    ],

                    'login' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/login',
                            'defaults' => [
                                'controller' => Controller\AuthController::class
                            ],
                        ],
                        'may_terminate' => false,
                        'child_routes' => [
                            'GET-login' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'GET',
                                    'defaults' => [
                                        'controller' => Controller\AuthController::class,
                                        'action' => 'login',
                                    ],
                                ],
                            ],
                            'POST-login' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'POST',
                                    'defaults' => [
                                        'controller' => Controller\AuthController::class,
                                        'action' => 'loginComplete',
                                    ],
                                ],
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
                  /*  'panel' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/panel',
                            'defaults' => [
                                'controller' => Controller\OperatorController::class,
                            ],
                            'child_routes' => [
                                'booking-list' => [
                                    'type' => Method::class,
                                    'options' => [
                                        'verb' => 'GET',
                                        'route' => '/booking',
                                        'defaults' => [
                                            'controller' => Controller\OperatorController::class,
                                            'action' => 'bookingList',
                                        ],
                                    ],
                                ],
                                'current-booking' => [
                                    'type' => Method::class,
                                    'options' => [
                                        'verb' => 'POST',
                                        'route' => '/booking',
                                        'defaults' => [
                                            'controller' => Controller\OperatorController::class,
                                        ],
                                        'child_routes' => [
                                            'booking-id' => [
                                                'type' => Segment::class,
                                                'options' => [
                                                    'route' => '[/:id]',
                                                    'defaults' => [
                                                        'controller' => Controller\OperatorController::class,
                                                        'action' => 'currentBooking',
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ], */
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            Controller\IndexController::class => Controller\Factory\IndexControllerFactory::class,
            Controller\AuthController::class => Controller\Factory\IndexControllerFactory::class,
            Controller\OperatorController::class => Controller\Factory\OperatorControllerFactory::class,
        ],
    ],
    'service_manager' => [
        'factories' => [
            Entity\Repositories\UserRepository::class => Entity\Repositories\Factory\AuthRepositoryFactory::class,
            Service\UserManager::class => Service\Factory\UserManagerFactory::class,
            Service\BookingManager::class => Service\Factory\BookingManagerFactory::class,
            Service\EntityManager::class => Service\Factory\EntityManagerFactory::class,
            Service\MailManager::class => Service\Factory\MailManagerFactory::class,
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            'ZendSkeletonModule' => __DIR__ . '/../view',

        ],
        'strategies' => [
            'ViewJsonStrategy',
        ],
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
];
