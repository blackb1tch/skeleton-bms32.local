<?php

namespace ModuleApi\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;

class OperatorController extends AbstractActionController
{
    public function BookingListAction()
    {
        return new JsonModel([
            'status' => 'OK',
            'booking-list' => 'test',
        ]);
    }

    public function updateBookingAction()
    {
        $id = $this->params()->fromQuery('id', '1');
        return new JsonModel([
            'update' => 'OK',
            'booking_id' => $id,
        ]);
    }

    public function deleteBookingAction()
    {
        return new JsonModel([
            'delete' => 'OK',
            'booking' => 'delete',
        ]);
    }
}