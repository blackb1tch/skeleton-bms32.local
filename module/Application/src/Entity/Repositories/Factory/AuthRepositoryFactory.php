<?php

namespace Application\Entity\Repositories\Factory;

use Application\Entity\Repositories\UserRepository;
use Application\Service\EntityManager;
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