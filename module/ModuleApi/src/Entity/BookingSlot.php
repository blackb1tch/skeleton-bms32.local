<?php

namespace ModuleApi\Entity;

class BookingSlot
{
    private $time;
    private $date;
    private $is_available;

    public function __construct($time, $date, $is_available)
    {
        $this->time         = $time;
        $this->date         = $date;
        $this->is_available = $is_available;

    }
    /**
     * @return bool
     */
    public function isAvailable(): bool
    {
        return $this->is_available;
    }

    /**
     * @param bool $is_available
     */
    public function setIsAvailable(bool $is_available)
    {
        $this->is_available = $is_available;
    }

    /**
     * @return string
     */
    public function getDate(): string
    {
        return $this->date;
    }

    /**
     * @param string $date
     */
    public function setDate(string $date)
    {
        $this->date = $date;
    }

    /**
     * @return string
     */
    public function getTime(): string
    {
        return $this->time;
    }

    /**
     * @param string $time
     */
    public function setTime(string $time)
    {
        $this->time = $time;
    }
}