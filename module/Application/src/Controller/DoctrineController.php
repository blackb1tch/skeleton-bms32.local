<?php

namespace Application\Controller;

use Application\Entity\Post;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\View\Model\ViewModel;

class DoctrineController extends AbstractActionController
{
    /**
     * Entity manager.
     * @var Doctrine\ORM\EntityManager
     */
    private $entityManager;

    /**
     * Constructor is used for injecting dependencies into the controller.
     */
    public function __construct($entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function doctrineAction()
    {

        $isAjax = $this->getRequest()->isXmlHttpRequest();
        if ($isAjax) {

            return new JsonModel([

            ]);
        }
        return new ViewModel([

            ]
        );


    }
}