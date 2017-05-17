<?php

use Phalcon\Mvc\Controller;

class DefaultController extends Controller
{
    public function initialize(){
        $this->view->setLayout('index');
    }

    public function indexAction()
    {
        $this->response->redirect("/feed");
    }
}