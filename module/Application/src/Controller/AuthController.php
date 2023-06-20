<?php

namespace Application\Controller;

use Application\Form\LoginForm;
use Application\Form\BookingForm;
use Application\Form\StatusForm;
use Application\Service\UserManager;
use Application\Service\BookingManager;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;
use Zend\Session\SessionManager;

class AuthController extends AbstractActionController
{
    private $authManager;
    private $sessionContainer;

    function __construct(UserManager $authManager, $sessionContainer)
    {
        $this->authManager = $authManager;
        $this->sessionContainer = $sessionContainer;
    }

    public function loginAction()
    {
        if($this->sessionContainer->loggedIn) {
            return $this->redirect()->toRoute('menu',
                ['action' => 'index']);
        }
        $loginForm = new LoginForm();
        if ($this->getRequest()->isPost()) {

            // извлечение данных из формы
            $data = $this->params()->fromPost();
            if (empty($data)) {

                $data = ($this->getRequest()->getContent());
                $data = json_decode($data, true);
            }
            if (isset($data)) {
                $loginForm->setData($data);
                if ($loginForm->isValid()) {
                    // запуск менеджера
                    try{
                        $this->authManager->checkUser($data);
                        $this->sessionContainer->loggedIn = $data['login'];
                        return $this->redirect()->toRoute(
                            'menu',
                            ['action' => 'index']
                        );
                    }catch(\Exception $e){
                        return new ViewModel([
                            'loginForm' => $loginForm,
                            'error_message' => $e->getMessage(),
                        ]);
                    }
                }
            }
        }
        if ($this->getRequest()->isXmlHttpRequest()) {

            return new JsonModel([
                'loginForm' => 'true',
            ]);
        }
        return new ViewModel([
            'loginForm' => $loginForm,
        ]);
    }


    public function logoutAction()
    {
        if($this->sessionContainer->loggedIn) {
            unset($this->sessionContainer->loggedIn);

            return $this->redirect()->toRoute('login',
                ['action' => 'login']);
        }

    }

    
}