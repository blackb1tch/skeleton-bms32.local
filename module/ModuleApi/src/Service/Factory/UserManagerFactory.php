<?php

namespace ModuleApi\Service\Factory;

use ModuleApi\Entity\Repositories\UserRepository;
use ModuleApi\Entity\Repositories\BookingRepository;
use ModuleApi\Service\UserManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;
//use Zend\Session\SessionManager;

class UserManagerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $authRepository = $container->get(UserRepository::class);

        return new UserManager($authRepository);
    }

}