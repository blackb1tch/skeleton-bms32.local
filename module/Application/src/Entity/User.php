<?php

namespace Application\Entity;

class User
{
    private $id;
    private $login;
    private $password;
    private $registration_date;

    public function __constructor($array = null)
    {

    }

    function getId()
    {
        return $this->id;
    }

    function getLogin()
    {
        return $this->login;
    }

    function getPassword()
    {
        return $this->password;
    }
    function getRegistrationDate()
    {
        return $this->registration_date;
    }

    function setId($id)
    {
        $this->id = $id;
    }

    function setLogin($login)
    {
        $this->login = $login;
    }

    function setPassword($password)
    {
        $this->password = $password;
    }
    function setRegistrationDate($date = null)
    {
        $this->registration_date = $date;
        if (empty($date))
        {
            $this->registration_date = date('Y-m-d, H:i');
        }
    }
}