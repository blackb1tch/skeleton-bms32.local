<?php

namespace Application\Controller\Factory;

use Application\Controller\AuthController;
use Application\Service\UserManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;
use Zend\Session\Container;
use Zend\Session\SessionManager;

class AuthControllerFactory implements FactoryInterface
{

    public function __invoke(ContainerInterface $container, $requestedName, array $options = null): AuthController
    {
        $authManager = $container->get(UserManager::class);
        $sessionManager = $container->get(SessionManager::class);
        $sessionContainer = new Container('UserData', $sessionManager);
//        $sessionContainer = $container->get('UserData');

        return new AuthController($authManager, $sessionContainer);
    }
}