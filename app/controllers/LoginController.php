<?php

use Phalcon\Mvc\Controller;

class LoginController extends Controller
{
    public function indexAction()
    {
        $this->assets->addJs("res/login.js");
        $this->view->setLayout('login');
    }
}