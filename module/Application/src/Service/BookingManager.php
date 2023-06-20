<?php

namespace Application\Service;

use Application\Entity\Booking;
use Application\Entity\Repositories\BookingRepository;
use Application\Middleware\RoundTime;
use DateTimeImmutable;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use Application\Entity\BookingSlot;

class BookingManager
{

    /**
     * Entity manager.
     * @var \Doctrine\ORM\EntityManager
     */
    private $entityManager;
    public const WORK_HOURS = [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
    ];


    function __construct($entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /** возвращает массив объектов записей
     * $response - состояние записи 0/reject/confirm
     * @param mixed $status
     * @param $page
     * @return array
     */
    public function getList($status, $page)
    {
        try {
            return $this->entityManager->getRepository(Booking::class)->findByStatus($status, $page);
        } catch (\Exception $e) {
            return [
                'response' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * @param $page_limit : к-во записей на странице
     * @param $page_number : текущая страница
     * @param $status : статус
     * @return array
     * @throws \Exception
     */
//    public function getPage($page_limit, $page_number, $status): array
    public function getPage($params): array
    {


        try {
            $filtered_params = $this->checkParams($params);

            $rows = $this->entityManager->getRepository(Booking::class)->countRowsByFilterParams($filtered_params)[0]['count_pages'];
            // подсчет количества страниц
            $count_pages = $this->countPages($params['status'], $params['limit'], $rows);

            if ($params['page'] > $count_pages) {
                $params['page'] = $count_pages;
            }
            if ($params['page'] < 1) {
                $params['page'] = 1;
            }
            $filtered_params['offset'] = $params['limit'];
            $filtered_params['limit'] = $params['page'] * $params['limit'] - $params['limit'];

            $page = $this->entityManager->getRepository(Booking::class)->getPageByFilterParams($filtered_params);

            // форматировать время из американского формата в российский
            foreach ($page as $key => $booking) {
                $page[$key]['time'] = date('d.m.y H:i:s ', strtotime($booking['time']));

                $page[$key]['created_time'] = date('d.m.y H:i:s ', strtotime($booking['created_time']));
            }

            return [
                'page' => $page,
                'count_pages' => $count_pages,
            ];

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }


    /** возвращает количество страниц
     * @param $status
     * @param $page_limit : количество записей на странице
     * @return int
     */
    public function countPages($status, $page_limit, $rows): int
    {
        // всего записей
//        $count_rows_by_status = $this->entityManager->getRepository(Booking::class)->countRowsByStatus($status);

        if ($rows % $page_limit == 0) {
            $count_pages = $rows / $page_limit;
        } else {
            $count_pages = intdiv($rows, $page_limit) + 1;
        }
        return $count_pages;
    }

    public function filterParams($status, $page_number, $page_limit)
    {

        switch ($status) {
            case 'reject' :
                $status = 0;
                break;
            case 'confirm' :
                $status = 1;
                break;
            default :
                $status = null;
        }
        if (intval($page_number) == 0) {
            $page_number = 1;
        }
        if (!is_int($page_limit) == 0) {
            $page_limit = 5;
        }
        return [
            'status' => $status,
            'page_number' => $page_number,
            'page_limit' => $page_limit,
        ];
    }


    /**
     * @param $status_data array
     * @return string
     */
    public function updateStatus(array $status_data)
    {

        if (isset($status_data['reject'])) {
            $status_data = [
                'status' => 'reject',
                'booking_id' => $status_data['booking_id'],
            ];

        }
        if (isset($status_data['confirm'])) {
            $status_data = [
                'status' => 'confirm',
                'booking_id' => $status_data['booking_id'],
            ];
        }

        if ($status_data['status'] == 'reject' || $status_data['status'] == 'decline') {
            $filtered_status_data = [
                'status' => 0,
                'booking_id' => $status_data['booking_id'],
            ];
        } else
            if ($status_data['status'] == 'confirm' || $status_data['status'] == 'accept' || $status_data['status'] == 'approve') {
                $filtered_status_data = [
                    'status' => 1,
                    'booking_id' => $status_data['booking_id'],
                ];
            } else {
                throw new \Exception('Неверный статус: ' . $status_data['status']);
            }

        try {
            $booking = $this->entityManager->getRepository(Booking::class)->find($filtered_status_data['booking_id']);
            if (!$booking) {
                throw new \Exception('Запись с ID: "' . $filtered_status_data['booking_id'] . '" не найдена.');
            }

            $booking->setStatus($filtered_status_data['status']);
            $this->entityManager->flush();

        } catch (\Exception $e) {

            throw new \Exception($e->getMessage());
        }
    }

    /** добавляет новую запись в бд
     * @throws \Exception
     */
    public function addBooking($booking_data)
    {
        try {
            $booking = new Booking();

            $booking->setName($booking_data['name']);
            $booking->setEmail($booking_data['email']);
            $booking->setPhone($booking_data['phone']);
            $booking->setMessage($booking_data['booking-msg']);
            $booking->setTime(date('Y-m-d H:i', strtotime($booking_data['hidden_booking_time'])));
            $booking->setCreatedTime(date("Y-m-d H:i:s"));
//            $booking->setStatus();

            // Добавляем сущность в менеджер сущностей.
            $this->entityManager->persist($booking);

            // Применяем изменения к БД.
            $this->entityManager->flush();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
        return $booking->getId();
        // return $new_booking_id; неплохо бы возвращать id-букинга
    }

    /**
     * @param $id
     * @return void
     * @throws \Exception
     */
    public function deleteBookingById($id)
    {
        try {
            $booking = $this->getBookingById($id);
            $this->entityManager->remove($booking);
            $this->entityManager->flush();

        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }


    /**
     * @param $id integer
     * @return array | Booking object
     * @throws \Exception
     */
    public function getBookingById(int $id)
    {
        try {
            $booking = $this->entityManager->getRepository(Booking::class)->findOneById($id);
            if (!$booking) {
                throw new \Exception('Запись с ID: ' . $id . ' не найдена!');
            }
            return $booking;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
//            return [
//                'response' => 'error',
//                'message' => $e->getMessage(),
//            ];
        }
    }

    public function updateBookingById(array $booking_data)
    {
        try {
            $booking = $this->entityManager->getRepository(Booking::class)->find($booking_data['id']);
            if (!$booking) {
                throw new \Exception('Запись с ID: "' . $booking_data['id'] . '" не найдена.');
            }


            $booking->setId($booking_data['id']);
            $booking->setName($booking_data['name']);
            $booking->setEmail($booking_data['email']);
            $booking->setPhone($booking_data['phone']);
            $booking->setMessage($booking_data['booking-msg']);
            $booking->setTime($booking_data['hidden_booking_time']);

            $this->entityManager->flush();

        } catch (\Exception $e) {

            throw new \Exception($e->getMessage());
        }
    }


    /**
     * @param string $date Дата для которой готовятся слоты
     * @return array
     * @throws \Exception
     */
    public function getBookingTimeSlots(string $date): array
    {
        try {
            $all_time_intervals = self::WORK_HOURS;

            $not_available_time_intervals_by_now_time = [];
            $current_date = date('Y-m-d');
            if ($current_date == $date) {
                // недоступное (прошедешее) время по текущему времени
                $roundTime = new RoundTime();
                $not_available_time_intervals_by_now_time = $roundTime->roundNotAvailableTime($all_time_intervals);
            }

            // массив времени всех занятых слотов
            $booking_time_array_by_date = $this->entityManager->getRepository(Booking::class)->getBookingsTimeArrayByDate($date);
            $not_available_time_intervals_by_booking = [];
            foreach ($booking_time_array_by_date as $time_slot) {
                $not_available_time_intervals_by_booking[] = date('H:i', strtotime($time_slot['time']));
            }

            $unavailable_time_intervals = array_merge($not_available_time_intervals_by_now_time, $not_available_time_intervals_by_booking);
            // добавляем занятое время в массив
            $unavailable_time_intervals = $this->addNotAvailableTime($unavailable_time_intervals);

            // сортировка не доступного времени записи
            usort($unavailable_time_intervals, [BookingManager::class, "dateSort"]);

            return $this->createBookingSlotsArray($all_time_intervals, $unavailable_time_intervals, $date);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }


    /** добавить не рабочие часы
     * @return array возвращает массив не рабочего времени
     */
    private function addNotAvailableTime($time_array = null): array
    {
        $not_available_time = [
            '13:00',
            '13:30',
        ];
        if (isset($time_array)) {
            $not_available_time = array_merge($time_array, $not_available_time);
        }
        return $not_available_time;
    }

    /** возвращает массив ключ => время, значение => массив['доступность'=0/1]
     * @param $all_time_intervals array
     * @param $unavailable_time_intervals array
     * @param $date string
     * @return array
     */
    private function createBookingSlotsArray(array $all_time_intervals, array $unavailable_time_intervals, string $date): array
    {
        $array_of_available_time_for_booking = [];


        // формировка массива
        foreach ($all_time_intervals as $time) {
            $array_of_available_time_for_booking [$time] = new BookingSlot($time, $time . ' ' . $date, true);


            foreach ($unavailable_time_intervals as $n_a_time) {
                if ($time === $n_a_time) {
                    $array_of_available_time_for_booking [$n_a_time] = new BookingSlot($n_a_time, $time . ' ' . $date, false);

                }
            }
        }

        return $array_of_available_time_for_booking;
    }

    /** функция сортировки времени в массиве для usort()
     * @param $a
     * @param $b
     * @return int
     */
    private function dateSort($a, $b)
    {
        if ($a == $b) {
            return 0;
        }
        return (strtotime($a) < strtotime($b)) ? -1 : 1;
    }

    public function dayTranslate($date)
    {
        $day_of_the_week = date('l', strtotime($date));
        $week = [
            'Monday' => 'Понедельник',
            'Tuesday' => 'Вторник',
            'Wednesday' => 'Среда',
            'Thursday' => 'Четверг',
            'Friday' => 'Пятница',
            'Saturday' => 'Суббота',
            'Sunday' => 'Воскресенье',
        ];
        foreach ($week as $day_in_english => $day_in_russian) {
            if ($day_in_english == $day_of_the_week) {
                $day_of_the_week = $day_in_russian;
                break;
            }
        }

        return $day_of_the_week;
    }

    private function checkParams($params)
    {
        switch ($params['status']) {
            case ('null'):
                $params['status'] = 'IS NULL';
                break;
            case ('0'):
            case 0:
                $params['status'] = '= 0';
                break;
            case ('1'):
            case 1:
                $params['status'] = '= 1';
                break;
            default:
                throw new \Exception('Статус введен не верно:' . $params['status']);
        }
        switch ($params['sort-by']) {
            case ('id'):
                $params['sort-by'] = 'id';
                break;
            default:
                throw new \Exception('Поле сортировки введено не верно:' . $params['sort-by']);
        }
        switch ($params['asc-or-desc']) {
            case ('ASC'):
            case ('asc'):
                $params['asc-or-desc'] = 'ASC';
                break;
            case ('DESC'):
            case ('desc'):
                $params['asc-or-desc'] = 'DESC';
                break;
            default:
                throw new \Exception('Параметр сортировки введен не верно:' . $params['asc-or-desc']);
        }

        if (isset($params['search-by'])) {
            switch ($params['search-by']) {
                case ('id'):
                    $params['search-by'] = 'id';
                    break;
                case ('name'):
                    $params['search-by'] = 'name';
                    break;
                case ('email'):
                    $params['search-by'] = 'email';
                    break;
                case ('phone'):
                    $params['search-by'] = 'phone';
                    break;
                default:
                    throw new \Exception('Неизвестное поле для поиска:' . $params['search-by']);
            }
            $params['search-word'] = htmlspecialchars($params['search-word']);
        }
        if (isset($params['date-or-create-date'])) {
            switch ($params['date-or-create-date']) {
                case ('created-date'):
                    $params['date-or-create-date'] = 'created_time';
                    break;
                case ('date'):
                    $params['date-or-create-date'] = 'time';
                    break;
                default:
                    throw new \Exception('Неизвестное поле для поиска:' . $params['sdate-or-create-date']);
            }
            if (isset($params['date-from'])) {
                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $params['date-from'])) {
                    throw new \Exception('Неверный формат даты!');
                }
            } else {
                $params['date-from'] = '1970-01-01';
            }
            if (isset($params['date-to'])) {
                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $params['date-to'])) {
                    throw new \Exception('Неверный формат даты!');
                }
            } else {
                $params['date-to'] = date('Y-m-d');
            }

        }
        return $params;
    }
}
