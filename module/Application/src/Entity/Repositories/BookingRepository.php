<?php

namespace Application\Entity\Repositories;


use Application\Entity\Booking;
use Doctrine\ORM\Query\ResultSetMapping;
use Doctrine\ORM\Query\ResultSetMappingBuilder;

use Doctrine\ORM\EntityRepository;


class BookingRepository extends EntityRepository
{


    public function getBookingsTimeArrayByDate($date): array
    {
        $sql = 'SELECT time, status FROM `booking` WHERE (status IS NULL OR status = 1) AND (time BETWEEN  "' . $date . ' 00:00:00" AND "' . $date . ' 23:59:59")';

        $rsm = new ResultSetMapping;
        $rsm->addScalarResult('time', 'time');
        $rsm->addScalarResult('status', 'status');

        $query = $this->getEntityManager()->createNativeQuery($sql, $rsm);

        return $query->getResult();
    }

    /** возвращает количество запсей по статусу
     * @param $status
     * @return int
     */
    public function countRowsByStatus($status)
    {
       return $this->count(['status' => $status]);
    }

    /**
     * @param $limit
     * @param $offset
     * @param $status
     * @return int|mixed|string
     */
    public function getPageByStatus($limit, $offset, $status)
    {
        $sql = 'SELECT * FROM `booking` WHERE status = ' . $status . ' LIMIT ' . $limit . ',' . $offset;

        if (is_null($status)/* || $status == 'null' || $status == 'NULL'*/) {
            $sql = 'SELECT * FROM `booking` WHERE status IS NULL  LIMIT ' . $limit . ',' . $offset;
        }
        $rsm = new ResultSetMapping;
        $rsm->addScalarResult('id', 'id');
        $rsm->addScalarResult('name', 'name');
        $rsm->addScalarResult('email', 'email');
        $rsm->addScalarResult('phone', 'phone');
        $rsm->addScalarResult('message', 'message');
        $rsm->addScalarResult('time', 'time');
        $rsm->addScalarResult('created_time', 'created_time');
        $rsm->addScalarResult('status', 'status');

        $query = $this->getEntityManager()->createNativeQuery($sql, $rsm);

        return $query->execute();
//        return $query->getResult();
    }
    /**
     * @param int $page
     * @param null $status
     * @return int|mixed|string
     */
    public function findByStatus($status = null, int $page = 1)
    {
        if ($page < 1) {
            $page = 1;
        }
        $page_limit = 5;

        // подсчет количества заявок
        $count_rows = $this->countRowsByStatus($status);
        if ($page * $page_limit > $count_rows) {
            $page = intdiv($count_rows, $page_limit) + 1;
        }

        $offset = $page_limit * $page;
        $limit = $offset - $page_limit;
        $sql = 'SELECT * FROM `booking` WHERE status = ' . $status . ' LIMIT ' . $limit . ',' . $offset;

        if ($status == null) {
            $sql = 'SELECT * FROM `booking` WHERE status IS NULL  LIMIT ' . $limit . ',' . $offset;
        }

        $rsm = new ResultSetMapping;
        $rsm->addScalarResult('id', 'id');
        $rsm->addScalarResult('name', 'name');
        $rsm->addScalarResult('email', 'email');
        $rsm->addScalarResult('phone', 'phone');
        $rsm->addScalarResult('message', 'message');
        $rsm->addScalarResult('time', 'time');
        $rsm->addScalarResult('created_time', 'created_time');
        $rsm->addScalarResult('status', 'status');

        $query = $this->getEntityManager()->createNativeQuery($sql, $rsm);

//        $booking_array_list = $query->getArrayResult();
//        $booking_object_list = [];
//        foreach ($booking_array_list as $booking_array)
//        {
//            $booking = new BookingForm();
//            $booking->setId($booking_array['id']);
//            $booking->setName($booking_array['name']);
//            $booking->setEmail($booking_array['email']);
//            $booking->setPhone($booking_array['phone']);
//            $booking->setMessage($booking_array['message']);
//            $booking->setTime($booking_array['time']);
//            $booking->setCreatedTime($booking_array['created_time']);
//            $booking->setStatus($booking_array['status']);
//
//            $booking_object_list [] = $booking;
//        }


        return $query->execute();
//        return $query->getArrayResult();

    }
}