<?php

namespace ModuleApi\Controller\Factory;

use ModuleApi\Controller\IndexController;
use ModuleApi\Service\BookingManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class IndexControllerFactory implements FactoryInterface
{

    public function __invoke(ContainerInterface $container, $requestedName, array $options = null): IndexController
    {
        $bookingManager = $container->get(BookingManager::class);
//        $sessionManager = $container->get(SessionManager::class);
//        $sessionContainer = new Container('UserData', $sessionManager);

        return new IndexController($bookingManager /*, $sessionContainer*/);

    }
}
{

}