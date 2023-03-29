<?php

namespace Application\Entity;
use Doctrine\ORM\Mapping as ORM;
use Application\Entity\Repositories\BookingRepository;

/**
 * This class represents a single post in a blog.
 * @ORM\Entity(repositoryClass="Application\Entity\Repositories\BookingRepository")
 * @ORM\Table(name="booking")
 */
class Booking
{
    /**
     * @ORM\Id
     * @ORM\Column(name="id")
     * @ORM\GeneratedValue
     */
    private $id;

    /**
     * @ORM\Column(name="name")
     */
    private $name;

    /**
     * @ORM\Column(name="email")
     */
    private $email;

    /**
     * @ORM\Column(name="phone")
     */
    private $phone; // 79250520505

    /**
     * @ORM\Column(name="message")
     */
    private $message;

    /**
     * @ORM\Column(name="time")
     */
    private $time;

    /**
     * @ORM\Column(name="created_time")
     */
    private $created_time;

    /**
     * @ORM\Column(name="status")
     */
    private $status;

    public function __constructor()
    {
//        $this->id = $array['id'];
//        $this->available_time = $array['time'];
//        $this->phone = $this->setPhone($array['phone']);//int 79051775860
    }

    function getId()
    {
        return $this->id;
    }

    /**
     * Sets ID of this post.
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * Returns name.
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Sets name.
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }


    /**
     * Returns email.
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Sets email.
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * Returns phone.
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Sets phone.
     * @param string $phone
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
    }

    /**
     * Returns message.
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Sets message.
     * @param string $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }

    /**
     * Returns time.
     * @return string
     */
    public function getTime()
    {
        return $this->time;
    }

    /**
     * Sets time.
     * @param string $time
     */
    public function setTime($time)
    {
        $this->time = $time;
    }

    /**
     * Returns created_time.
     * @return string
     */
    public function getCreated_time(): string
    {
        return $this->created_time;
    }

    /**
     * Sets created_time.
     * @param string $created_time
     */
    public function setCreatedTime(string $created_time)
    {
        $this->created_time = $created_time;
    }

    /**
     * Returns status.
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Sets status.
     * @param string $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }



}