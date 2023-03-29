<?php

namespace ModuleApi\Service;

use ModuleApi\Entity\User;
use ModuleApi\Entity\Repositories\UserRepository;

class UserManager
{
    private $entityManager;
    private $sessionManager;
    private $authRepository;

    // Конструктор, используемый для внедрения зависимостей в сервис.
    public function __construct($authRepository /*$sessionManager*/)
    {
        $this->authRepository = $authRepository;
//        $this->sessionManager = $sessionManager;
    }

    /** сортирует данные из бд
     * @param $user_data
     * @return bool
     */
    public function addUser($user_data)
    {
        try {
            $user = new User();
            $user->setLogin($user_data['login']);
            $user->setPassword($user_data['password']);
            $user->setRegistrationDate();

//            $authRepository = new UserRepository();
            $this->authRepository->add($user);

            return true;

        } catch (\Exception $e) {
            return [
                'response' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /** сравнивает пароль и логин юзера с базой
     * @param $user_data array
     * @return bool
     */
    public function checkUser(array $user_data): bool
    {
        try {
            $user = new User();
            $user->setLogin($user_data['login']);
            $user->setPassword($user_data['password']);
            $user->setRegistrationDate();

//            $authRepository = new UserRepository();
            $this->authRepository->getByUserData($user->getLogin(), $user->getPassword());

            return true;
        } catch (\Exception $e) {
            throw new \Exception('репозиторий послал меня с ошибкой: '.$e->getMessage());
        }
    }
}