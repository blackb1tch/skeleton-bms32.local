<?php

namespace ModuleApi\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * This class represents a single post in a blog.
 * @ORM\Entity
 * @ORM\Table(name="post")
 */
class Post
{

    /**
     * @ORM\Id
     * @ORM\Column(name="id")
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\Column(name="name")
     */
    protected $name;

    /**
     * @ORM\Column(name="user")
     */
    protected $user;


    /**
     * Returns ID of this post.
     * @return integer
     */
    public function getId() : int
    {
        return $this->id;
    }

    /**
     * Sets ID of this post.
     * @param int $id
     */
    public function setId(int $id)
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
     * Returns user.
     * @return string
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Sets user.
     * @param string $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }
}

