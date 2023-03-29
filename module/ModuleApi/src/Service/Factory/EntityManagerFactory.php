<?php

namespace ModuleApi\Service\Factory;

use ModuleApi\Service\EntityManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class EntityManagerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $config = $container->get('Config')['DB'];
        return new EntityManager($config);
    }
}