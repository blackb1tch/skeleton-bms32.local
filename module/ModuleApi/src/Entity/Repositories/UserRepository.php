<?php

namespace ModuleApi\Entity\Repositories;

use ModuleApi\Entity\User;
use mysqli;

class UserRepository
{
    private $entityManager;

    public function __construct($entityManager)
    {
//        $servername = "localhost";
//        $username = "root";
//        $password = "";
//        $dbname = "bms32";
//
//        $conn = new mysqli($servername, $username, $password, $dbname);
//        $conn->set_charset("utf8");
//
//        if ($conn->connect_error) {
//            die("Connection failed: " . $conn->connect_error);
//        }
//        return $this->connection = $conn;
        $this->entityManager = $entityManager;
    }

    /** возвращает объект User, по параметру
     * @param $user_id
     * @return User
     * @throws \Exception
     *
     */
    public function getById($user_id)
    {
//        $conn = $this->connection;
        $sql = "SELECT * FROM user WHERE id=$user_id";
//        $res = $this->sqlExec($sql);
        $this->entityManager->sqlExec($sql);

        if ($this->entityManager->countRows() > 0) {
            $res = $this->entityManager->getRow();
            foreach ($res as $output) {
                $user = new User();

                $user->setId($output['id']);
                $user->setLogin($output['login']);
                $user->setPassword($output['password']);
            }

            return $user;
        }
        throw new \Exception('Пользователь с таким id не найден');
    }

    /**
     * @param $user_login
     * @return bool
     * @throws \Exception
     */
    public function getByUserData($login, $password)
    {

        $sql = 'SELECT * FROM user WHERE login="' . $login . '" AND password=password("' . $password . '")';
//        $sql = 'SELECT * FROM user WHERE login=' . $login . ' AND password=' . $password;
        //        $res = $this->sqlExec($sql);
        $this->entityManager->sqlExec($sql);

        if ($this->entityManager->countRows() > 0) {
            $output = $this->entityManager->getRow();

            $user = new User();

            $user->setId($output['id']);
            $user->setLogin($output['login']);
            $user->setPassword($output['password']);

            return true;
        }

        throw new \Exception('Неверный логин или пароль.');
    }

    public function add($user): bool
    {

        $login = $user->getLogin();
        $password = $user->getPassword();
        $registration_date = $user->getRegistrationDate();

//      $conn = $this->connection;
        $sql = 'INSERT INTO user (login, password, reg_date) VALUES ("' . $login . '", password("' . $password . '"),"' . $registration_date . '")';
        return $this->entityManager->sqlExec($sql);
    }

//    private function sqlExec(string $sql)
//    {
//        $res = $this->connection->query($sql);
////        $this->res = $this->connection->query($sql);
//
//        if (!$res) {
//            throw new \Exception(mysqli_error($this->connection));
//        }
//
//        return $res;
//    }
}
