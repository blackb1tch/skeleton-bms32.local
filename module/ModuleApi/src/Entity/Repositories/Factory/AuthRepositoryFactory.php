<?php

namespace ModuleApi\Entity\Repositories\Factory;

use ModuleApi\Entity\Repositories\UserRepository;
use ModuleApi\Service\EntityManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class AuthRepositoryFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $entityManager = $container->get(EntityManager::class);

        return new UserRepository($entityManager);
    }

}