<?php

use Phalcon\Mvc\Controller;

class DefaultController extends Controller
{
    public function initialize(){
        $this->view->setLayout('index');
        $this->view->currentProfile = Helper::getCurrentProfile();
    }
}