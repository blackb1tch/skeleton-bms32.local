<?php

namespace Application\Entity\Repositories;

class BookingCollection
{
    private $conn;
    private $limit;
    private $_page;
    private $_query;
    private $_total;


    public function __construct()
    {
        $this->setLimit(5);
        $bookings_array = [];
    }

    public function getPage()
    {

    }

    public function setLimit($limit)
    {
        $this->limit = $limit;
    }
}
