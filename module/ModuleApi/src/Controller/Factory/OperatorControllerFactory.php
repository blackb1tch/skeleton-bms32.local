<?php

namespace ModuleApi\Controller\Factory;

use ModuleApi\Controller\OperatorController;
use ModuleApi\Service\BookingManager;
use ModuleApi\Service\MailManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;
use Zend\Session\Container;
use Zend\Session\SessionManager;

class OperatorControllerFactory implements FactoryInterface
{

    public function __invoke(ContainerInterface $container, $requestedName, array $options = null): OperatorController
    {
        $bookingManager = $container->get(BookingManager::class);
        $mailManager = $container->get(MailManager::class);
        $sessionManager = $container->get(SessionManager::class);
        $sessionContainer = new Container('UserData', $sessionManager);

        return new OperatorController($bookingManager, $mailManager, $sessionContainer);
    }
}
