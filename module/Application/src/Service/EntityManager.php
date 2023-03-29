<?php

namespace Application\Service;

use mysqli;

class EntityManager
{
    private $connection;
    private $resource;

//    private $config;
    public function __construct(array $config)
    {
        $this->connection = new mysqli($config['url'], $config['username'], $config['password'], $config['dbname']);
        $this->connection->set_charset("utf8");

        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }
    }

    public function getAll()
    {
        return $this->resource->fetch_all(MYSQLI_ASSOC);
    }

    public function getRow()
    {
        return $this->resource->fetch_assoc();
    }

    public function sqlExec(string $sql)
    {
        $this->resource = $this->connection->query($sql);

        if (!$this->resource) {
            throw new \Exception(mysqli_error($this->connection));
        }

        return $this->resource;
    }

    public function countRows()
    {
        return $this->resource->num_rows;
    }
}