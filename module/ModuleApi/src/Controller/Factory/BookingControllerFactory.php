<?php

namespace ModuleApi\Controller\Factory;

use Application\Service\BookingManager;
use Interop\Container\ContainerInterface;
use ModuleApi\Controller\BookingController;
use Zend\Session\Container;
use Zend\Session\SessionManager;

class BookingControllerFactory
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null): BookingController
    {
        $bookingManager = $container->get(BookingManager::class);
        $sessionManager = $container->get(SessionManager::class);
        $sessionContainer = new Container('UserData', $sessionManager);

        return new BookingController($bookingManager, $sessionContainer);
    }
}