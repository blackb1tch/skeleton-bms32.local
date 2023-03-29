<?php

namespace Application\Service\Factory;

use Application\Entity\Repositories\UserRepository;
use Application\Entity\Repositories\BookingRepository;
use Application\Service\UserManager;
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