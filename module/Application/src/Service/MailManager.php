<?php

namespace Application\Service;

use Zend\Mail\Message;
use Zend\Mail\Transport\Sendmail;
use Zend\Mail\Transport\Smtp as SmtpTransport;
use Zend\Mail\Transport\FileOptions;
use Zend\Mail\Transport\SmtpOptions;

class MailManager
{
    private $config;
    private $message;
    private $transport;

    public function __construct($config)
    {
        $this->config = $config;
        $this->message = new Message();
        $this->message->setEncoding("UTF-8");

        //Setup File transport
        $this->transport = new SmtpTransport();
        $options = new SmtpOptions($this->config);
        $this->transport->setOptions($options);
    }

    // заявка подтверждена
    public function sendConfirmedMail($to, $time)
    {
        $subject = 'Ваша заявка на ремонт подтверждена!';
        $body = "Ждем вас в $time по адресу: г.Брянск, ул. Фрунзе 64А. Телефоны: 8-(4832)-66-38-58, 41-96-66. ";

        $this->sendMail($to, $subject, $body);
    }

    // заявка принята
    public function sendAcceptedMail($to, $time)
    {
        $subject = 'Ваша заявка на ремонт принята!';
        $body = 'Заявка на время ' . $time . ' принята. Мы свяжемся с вами в ближайшее время, для уточнения деталей.';

        $this->sendMail($to, $subject, $body);
    }

    private function sendMail($to, $subject, $body)
    {
        $this->message->addTo($to);
        $this->message->addFrom($this->config['connection_config']['username'], 'БрянскМАЗсервис');
        $this->message->setSubject($subject);
        $this->message->setBody($body);

        $this->transport->send($this->message);
        $this->message->isValid();
    }


}