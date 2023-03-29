<?php

namespace ModuleApi\Service;

use ModuleApi\Entity\Booking;
use ModuleApi\Entity\Repositories\BookingRepository;
use ModuleApi\Middleware\RoundTime;
use DateTimeImmutable;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use ModuleApi\Entity\BookingSlot;

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
    public function getPage($page_limit, $page_number, $status): array
    {
        try {

            // подсчет количества страниц
            $count_pages = $this->countPages($status, $page_limit);

            if ($page_number > $count_pages) {
                $page_number = $count_pages;
            }
            if ($page_number < 1) {
                $page_number = 1;
            }
            $offset = $page_limit;
            $limit = $page_number * $page_limit - $page_limit;

            return [
                'page' => $this->entityManager->getRepository(Booking::class)->getPageByStatus($limit, $offset, $status),
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
    public function countPages($status, $page_limit): int
    {
        // всего записей
        $count_rows_by_status = $this->entityManager->getRepository(Booking::class)->countRowsByStatus($status);

        if ($count_rows_by_status % $page_limit == 0) {
            $count_pages = $count_rows_by_status / $page_limit;
        } else {
            $count_pages = intdiv($count_rows_by_status, $page_limit) + 1;
        }
        return $count_pages;
    }

    public function filterParams($status, $page_number, $page_limit)
    {
        /*
        if ($status != 'confirm' && $status != 'reject' && $status != 'new') {
//          $status = null;
            unset($status);
        }
        if ($status == 'new') {
//            $status = null;
            unset($status);
        }
        if ($status == 'confirm') {
            $status = 1;
        }
        if ($status == 'reject') {
            $status = 0;
        }
        */
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
     * @return array|string
     */
    public function updateStatus(array $status_data)
    {
        $filtred_status_data = [
            'status' => null,
            'booking_id' => null,
        ];

        if (isset($status_data['reject'])) {
            $filtred_status_data = [
                'status' => 0,
                'booking_id' => $status_data['booking_id']
            ];
        }

        else if (isset($status_data['confirm'])) {
            $filtred_status_data = [
                'status' => 1,
                'booking_id' => $status_data['booking_id']
            ];
        } else {
            throw new \Exception('Неверный статус');
        }

        try {
            $booking = $this->entityManager->getRepository(Booking::class)->find($filtred_status_data['booking_id']);
            $booking->setStatus($filtred_status_data['status']);
            $this->entityManager->flush();
            return [
                'response' => 'success',
            ];
        } catch (\Exception $e) {
            return $e->getMessage();
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
     * @param $booking_id integer
     * @return array | Booking object
     */
    public function getBookingById(int $booking_id)
    {
        try {
            return $this->entityManager->getRepository(Booking::class)->findOneById($booking_id);
        } catch (\Exception $e) {
            return [
                'response' => 'error',
                'message' => $e->getMessage(),
            ];
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
                // недоступное (прошедшее) время по текущему времени
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
}
