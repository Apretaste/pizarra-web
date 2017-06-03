<?php

use Phalcon\Mvc\Controller;

class DefaultController extends Controller
{
    public function initialize(){
        $this->view->setLayout('index');
        $this->view->currentProfile = Helper::getCurrentProfile();
        $this->view->message = false;
		$this->view->showRefreshButton = false;
        $this->view->showSearchButton = true;
        $this->view->showProfileButton = true;
        $this->view->showChatsButton = true;

        if (Helper::hasFlag("message"))
        {
            $this->view->message = Helper::getFlag("message");
            $this->view->message_type = Helper::getFlag("message_type");
            Helper::delFlag("message");
            Helper::delFlag("message_type");
        }
    }
}