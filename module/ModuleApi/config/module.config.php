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
                    'booking' => [
                        'type' => Literal::class,
                        'options' => [
                            'route' => '/booking',
                            'defaults' => [
                                'controller' => Controller\BookingController::class
                            ],
                        ],
                        'may_terminate' => false,
                        'child_routes' => [

                            'create-booking' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'POST',
                                    'defaults' => [
                                        'controller' => Controller\BookingController::class,
                                        'action' => 'create',
                                    ],
                                ],
                            ],
                            'list-booking' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'GET',
                                    'defaults' => [
                                        'controller' => Controller\BookingController::class,
                                    ],
                                ],
                                'child_routes' => [
                                    'params-list-booking' => [
                                        'type' => Segment::class,
                                        'options' => [
                                            'route' =>
                                                '[/is-approved/:boolean-or-is_null]' .
                                                '[/sort-by/:sort-by-id-or-phone-or-name-or-email]' .
                                                '[/asc-or-desc/:asc-or-desc]' .
                                                '[/search-by/:search-by-id-or-phone-or-name-or-email]' .
                                                '[/search-word/:word]' .
                                                '[/date-or-create-date/:date]' .
                                                '[/from/:from]' .
                                                '[/to/:to]' .
                                                '[/page/:page]' .
                                                '[/limit/:limit]',
                                            'defaults' => [
                                                'controller' => Controller\BookingController::class,
                                                'action' => 'list',
                                            ],
                                        ],
                                    ],
                                ]
                            ],
                            'update-booking' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'PUT',
                                    'defaults' => [
                                        'controller' => Controller\BookingController::class,
                                    ],
                                ],
                                'child_routes' => [
                                    'approve-booking' => [
                                        'type' => Segment::class,
                                        'options' => [
                                            'route' => '/approve[/:id]',
                                            'defaults' => [
                                                'controller' => Controller\BookingController::class,
                                                'action' => 'approve',
                                            ],
                                        ],
                                    ],
                                    'decline-booking' => [
                                        'type' => Segment::class,
                                        'options' => [
                                            'route' => '/decline[/:id]',
                                            'defaults' => [
                                                'controller' => Controller\BookingController::class,
                                                'action' => 'decline',
                                            ],
                                        ],
                                    ],
                                    'edit-booking' => [
                                        'type' => Segment::class,
                                        'options' => [
                                            'route' => '/edit[/:id]',
                                            'defaults' => [
                                                'controller' => Controller\BookingController::class,
                                                'action' => 'edit',
                                            ],
                                        ],
                                    ]
                                ]
                            ],
                            'delete-booking' => [
                                'type' => Method::class,
                                'options' => [
                                    'verb' => 'DELETE',
                                    'defaults' => [
                                        'controller' => Controller\BookingController::class,
                                    ],
                                ],
                                'child_routes' => [
                                    'delete-booking-id' => [
                                        'type' => Segment::class,
                                        'options' => [
                                            'route' => '[/:id]',
                                            'defaults' => [
                                                'controller' => Controller\BookingController::class,
                                                'action' => 'delete',
                                            ],
                                        ],
                                    ],
                                ]
                            ],
                        ],
                    ],

                    'not-booked-time' => [
                        'type' => Literal::class,
                        'may_terminate' => true,
                        'options' => [
                            'route' => '/not-booked-time',
                            'defaults' => [
                                'controller' => Controller\IndexController::class,
                                'action' => 'notBookedTime',
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
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            Controller\IndexController::class => Controller\Factory\IndexControllerFactory::class,
            Controller\BookingController::class => Controller\Factory\BookingControllerFactory::class,
            Controller\AuthController::class => Controller\Factory\IndexControllerFactory::class,
            Controller\OperatorController::class => Controller\Factory\OperatorControllerFactory::class,
        ],
    ],
    'service_manager' => [
        'factories' => [
            Entity\Repositories\UserRepository::class => Entity\Repositories\Factory\AuthRepositoryFactory::class,
//            Service\UserManager::class => Service\Factory\UserManagerFactory::class,
//            Service\BookingManager::class => Service\Factory\BookingManagerFactory::class,
//            Service\EntityManager::class => Service\Factory\EntityManagerFactory::class,
//            Service\MailManager::class => Service\Factory\MailManagerFactory::class,
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
//    'doctrine' => [
//        'driver' => [
//            __NAMESPACE__ . '_driver' => [
//                'class' => AnnotationDriver::class,
//                'cache' => 'array',
//                'paths' => [__DIR__ . '/../src/Entity']
//            ],
//            'orm_default' => [
//                'drivers' => [
//                    __NAMESPACE__ . '\Entity' => __NAMESPACE__ . '_driver'
//                ]
//            ]
//        ],
//    ],
];
