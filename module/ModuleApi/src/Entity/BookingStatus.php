<?php

namespace ModuleApi\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BookingStatus
 *
 * @ORM\Table(name="booking_status")
 * @ORM\Entity
 */
class BookingStatus
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="status_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $statusId;

    /**
     * @var string|null
     *
     * @ORM\Column(name="comment", type="string", length=45, nullable=true)
     */
    private $comment;

    /**
     * @var string|null
     *
     * @ORM\Column(name="active", type="string", length=45, nullable=true)
     */
    private $active;


}
