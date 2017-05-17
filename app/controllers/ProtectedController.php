<?php

use Phalcon\Mvc\Controller;

class ProtectedController extends DefaultController
{
    /**
     * Security check
     *
     * @author kuma
     */
    public function initialize(){
        parent::initialize();
        $di = \Phalcon\DI\FactoryDefault::getDefault();
        if (!$di->getShared("session")->has("token"))
            header("Location: /login");
    }
}