<?php

use Phalcon\Mvc\Controller;

class ChatsController extends ProtectedController
{
    public function indexAction()
    {
        $this->view->notes = Helper::getActionResult("chats")->payload->notes;
    }

    public function withAction($username = null)
    {
        $this->view->friendProfile = Helper::getActionResult("profile", [$username])->payload->profile;
        $this->view->notes = Helper::getActionResult("chats", [$username])->payload->chats;
    }
}