<?php

namespace ModuleApi\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;

class OperatorController extends AbstractActionController
{
    private $bookingManager;
    private $sessionContainer;

    public function __construct($bookingManager, /* $mailManager, */ $sessionContainer)
    {
        $this->bookingManager = $bookingManager;
        $this->sessionContainer = $sessionContainer;
    }

    public function BookingListAction()
    {
        if ($this->sessionContainer->loggedIn) {
            return new JsonModel([
                'status' => 'OK',
                'booking-list' => 'test',
            ]);
        }
        // 403
    }

    public function updateBookingAction()
    {
        if ($this->sessionContainer->loggedIn) {
            $id = $this->params()->fromRoute('id', 0);
            $data = ($this->getRequest()->getContent());
            $status = json_decode($data, true)['status'];

            $status_data = [
                'status' => $status,
                'booking_id' => $id,
            ];

            try {
                $this->bookingManager->updateStatus($status_data);
            } catch (\Exception $e) {

                return new JsonModel([
                    'response' => 'error',
                    'message' => $e->getMessage(),
                ]);
            }


            return new JsonModel([
                'update' => 'success',
                'status' => $status,
                'id' => $id,
            ]);
        }
        // 403
    }

    public function deleteBookingAction()
    {
        if ($this->sessionContainer->loggedIn) {
            $id = $this->params()->fromRoute('id', 0);
            try {
                $this->bookingManager->deleteBookingById($id);
            } catch (\Exception $e) {

                return new JsonModel([
                    'delete' => 'error',
                    'message' => $e->getMessage(),
                ]);
            }


            return new JsonModel([
                'delete' => 'success',
                'id' => $id,
            ]);
        }
        // 403
    }
}