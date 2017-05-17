<?php

use Phalcon\Mvc\Controller;

class LogoutController extends Controller
{
    public function indexAction()
    {
        $di = \Phalcon\DI\FactoryDefault::getDefault();
        $di->getShared("session")->remove("token");
        header("Location: /login");
    }
}