<?php

namespace ModuleApi\Middleware;

use DateTime;
use Exception;

class RoundTime
{
    private $time;
    private $hour;
    private $minutes;

    /**
     * @throws Exception
     */
    function __construct($time = NULL)
    {
//        date_default_timezone_set('Europe/Moscow');
        $this->time = new DateTime();

        // тест времени
        if (isset($time)) {
            $time = new DateTime($time);
            $hour = $time->format("H");
            $minutes = $time->format("i");
            $this->time->setTime($hour, $minutes);
        }

        $this->hour = $this->time->format("H");
        $this->minutes = $this->time->format("i");


        if ($this->hour >= 18 || ($this->hour < 9 && $this->minutes < 30)) {
            $this->new_time = '9:00';
        } else {
            $this->time = $this->time->format('H:i');
            $this->new_time = $this->roundTime($this->time);
        }
    }

    /** округляет время до получаса/часа
     * @param string $time_string
     * @param int $precision
     * @return string
     * @throws Exception
     */
    private function roundTime(string $time_string, int $precision = 30): string
    {

        $datetime = new DateTime($time_string);
        //$datetime = $DateTime->date_create_from_format('H:i',$time_string);

        $datetime->add(new \DateInterval("PT30M"));

        $minute = $datetime->format("i");
        $minute = $minute % $precision;
        if ($minute == 0) {
            return $datetime->format('H:i');
        }

        if ($minute > 0) {
            $diff = $precision - $minute;
            $datetime->add(new \DateInterval("PT" . $diff . "M"));
        }

        return $datetime->format('H:i');
    }


    /**
     * @param $work_hours
     * @param $now_time
     * @return array
     * @throws Exception
     */
    public function roundNotAvailableTime($work_hours, $now_time = null)
    {

        if (isset($now_time)) {
            $now_time = date('H:i', strtotime($now_time));
        } else {
            $now_time = date('H:i');
        }

        $round_now_time = $this->roundTime($now_time);
        $not_available_time = [];

        foreach ($work_hours as $time) {
            if (strtotime($round_now_time) > strtotime($time)) {
                $not_available_time [] = $time;
            }
        }
        return $not_available_time;

    }

}