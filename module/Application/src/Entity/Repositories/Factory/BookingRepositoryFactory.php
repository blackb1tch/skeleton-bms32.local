<?php

namespace Application\Entity\Repositories\Factory;

use Application\Entity\Booking;
use Application\Entity\Repositories\BookingRepository;
use Application\Service\EntityManager;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

//class BookingRepositoryFactory implements FactoryInterface
//{
//    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
//    {
//        $booking = $container->get(BookingForm::class);
//        $entityManager = $container->get('doctrine.entitymanager.orm_default');
//
//        return new BookingRepository($entityManager,$booking );
//    }
//}


