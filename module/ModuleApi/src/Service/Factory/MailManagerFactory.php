<?php

namespace ModuleApi\Service\Factory;

use ModuleApi\Service\MailManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class MailManagerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $config = $container->get('Config')['mail'];

        return new MailManager($config);
    }
}