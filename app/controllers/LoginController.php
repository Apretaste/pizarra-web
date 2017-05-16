<?php

use Phalcon\Mvc\Controller;

class LoginController extends Controller
{
    public function indexAction()
    {
        $this->assets->addJs("res/js/login.js");
        $this->view->setLayout('index');
    }
}