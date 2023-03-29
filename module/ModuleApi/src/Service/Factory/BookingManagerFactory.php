<?php

namespace ModuleApi\Service\Factory;

use ModuleApi\Entity\Repositories\BookingRepository;
use ModuleApi\Service\BookingManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class BookingManagerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
//        $bookingRepository = $container->get(BookingRepository::class);
        $entityManager = $container->get('doctrine.entitymanager.orm_default');

        return new BookingManager( $entityManager);
    }
}