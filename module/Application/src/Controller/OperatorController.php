<?php

namespace Application\Controller;

use Application\Form\StatusForm;
use Application\Service\BookingManager;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zend\Mvc\Controller\AbstractActionController;

class OperatorController extends AbstractActionController
{
    private $bookingManager;
    private $mailManager;
    private $sessionContainer;

    function __construct(BookingManager $bookingManager, $mailManager, $sessionContainer)
    {
        $this->bookingManager = $bookingManager;
        $this->mailManager = $mailManager;
        $this->sessionContainer = $sessionContainer;

    }

    public function indexAction()
    {
        $this->layout()->setTemplate('layout/operator-layout');
        if ($this->sessionContainer->loggedIn) {
            $is_sure = false;

            $status = $this->params()->fromRoute('status');
            $page_limit = $this->params()->fromRoute('limit', 5);
            $page_number = $this->params()->fromRoute('page', 1);

            $url_params = $this->bookingManager->filterParams($status, $page_number, $page_limit);

            try {
                // получение страницы, количества страниц
                $pageArray = $this->bookingManager->getPage($url_params['page_limit'], $url_params['page_number'], $url_params['status']);

            } catch (\Exception $e) {
                $viewModel = new ViewModel([
                    'error_message' => $e->getMessage(),
                ]);
                $viewModel->setTemplate('error/exception-error');
                return $viewModel;
            }
            if (empty($status)){
                $status = 'new';
            }
            $paginatorParams = [
                'count_pages' => $pageArray['count_pages'],
                'previous' => $url_params['page_number'] - 1,
                'next' => $url_params['page_number'] + 1,
                'current' => $url_params['page_number'],
                'url' => '/' . $status . '/' . $url_params['page_limit'] . '/',
            ];


            $statusFormConfirm = new StatusForm();
            $statusFormReject = new StatusForm();

            $isAjax = $this->getRequest()->isXmlHttpRequest();
            if ($isAjax) {

                return new JsonModel([
                    'booking_card_list' => $pageArray['page'],
                    'is_sure' => $is_sure,
                    'paginatorParams' => $paginatorParams,
                ]);
            }
            return new ViewModel([
                'booking_card_list' => $pageArray['page'],
                'statusFormConfirm' => $statusFormConfirm,
                'statusFormReject' => $statusFormReject,
                'is_sure' => $is_sure,
                'paginatorParams' => $paginatorParams,
            ]);
        }
        // err нет доступа
        return $this->notFoundAction();
    }

    /**
     * @return \Zend\Http\Response|ViewModel
     *
     */
    public function areYouSureAction()
    {
        if ($this->sessionContainer->loggedIn) {
            $this->layout()->setTemplate('layout/operator-layout');

            $statusForm = new StatusForm();
            if ($this->getRequest()->isPost()) {


                $data = $this->params()->fromPost();
                if (empty($data)) {

                    $data = ($this->getRequest()->getContent());
                    $data = json_decode($data, true);
                }

                if ($this->getRequest()->isXmlHttpRequest()) {
                    $xml_http_data = [
                        $data['rejectOrConfirm'] => $data['rejectOrConfirm'],
                        'booking_id' => $data['booking_id']
                    ];
                    try {
                        $this->bookingManager->updateStatus($xml_http_data);
                    } catch (\Exception $e) {
                        return new JsonModel([
                            'rejectOrConfirm' => $data['rejectOrConfirm'],
                            'response' => 'error',
                            'message' => $e->getMessage(),
                            'url' => $data['url'],
                        ]);
                    }

                    return new JsonModel([
                        'rejectOrConfirm' => $data['rejectOrConfirm'],
                        'response' => 'success',
                        'url' => $data['url'],
                    ]);
                }

                $id = $data['booking_id'];
                $url = $data['url'];
                $booking = $this->bookingManager->getBookingById($id);
                $booking_array = [
                    'id' => $booking->getId(),
                    'name' => $booking->getName(),
                    'email' => $booking->getEmail(),
                    'phone' => $booking->getPhone(),
                    'message' => $booking->getMessage(),
                    'time' => $booking->getTime(),
                    'created_time' => $booking->getCreated_time(),
                    'status' => $booking->getStatus(),
                ];

                // обработка отклонения/подтверждения заявки
                if (isset($data['is_sure']) && $data['is_sure'] == 'sure') {
                    if (isset($data['url'])) {

                        $url = explode('/', $data['url']);

                    }
                    // подтверждение действия
                    if (isset($data['confirm'])) {
                        $this->bookingManager->updateStatus($data);
                        return $this->redirect()->toRoute('panel',
                            [
                                'action' => 'index',
                                'status' => $url[0],
                                'limit' => $url[1],
                                'page' => $url[2],
                            ]);
                    }

                    // отмена действия
                    if (isset($data['reject'])) {
                        return $this->redirect()->toRoute('panel',
                            [
                                'action' => 'index',
                                'status' => $url[1],
                                'limit' => $url[2],
                                'page' => $url[3],
                            ]);
                    }
                }

                $viewModel = new ViewModel([
                    'statusForm' => $statusForm,
                    'booking' => $booking_array,
                    'url' => $url,
                ]);


                if (isset($data['confirm'])) {
                    $viewModel->setTemplate('ModuleApiV1/operator/confirm');
                }
                if (isset($data['reject'])) {
                    $viewModel->setTemplate('ModuleApiV1/operator/reject');
                }

                return $viewModel;
            }
        }
        // err нет доступа
        return $this->notFoundAction();
    }
}