<?php

namespace ModuleApi\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\Controller\AbstractRestfulController;

class AuthController extends AbstractActionController
{
        public function loginAction()
        {
            die('login GET');
        }
        public function loginPOSTAction()
        {
            die('login POST');
        }
}