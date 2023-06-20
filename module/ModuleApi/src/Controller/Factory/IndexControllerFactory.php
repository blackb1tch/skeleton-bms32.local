<?php

namespace ModuleApi\Controller\Factory;

use Application\Service\BookingManager;
use ModuleApi\Controller\IndexController;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class IndexControllerFactory implements FactoryInterface
{

    public function __invoke(ContainerInterface $container, $requestedName, array $options = null): IndexController
    {
        $bookingManager = $container->get(BookingManager::class);

        return new IndexController($bookingManager);

    }
}
