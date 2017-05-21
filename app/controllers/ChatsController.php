<?php

use Phalcon\Mvc\Controller;

class ChatsController extends ProtectedController
{
    public function indexAction()
    {
        $this->view->notes = Helper::getActionResult("chats")->payload->notes;
        $this->view->unread = Api::run("NOTA UNREAD")->items;
        foreach($this->view->unread as $note)
            $note->profile = Helper::processProfile($note->profile);

        if (count($this->view->notes) + count($this->view->unread) == 0)
        {
            Helper::setFlag("message", "No tienes conversaciones pendientes ni antiguas.");
            Helper::setFlag("message_type", "info");
            $this->response->redirect("feed");
        }
    }

    public function withAction($username = null)
    {
        $this->view->friendProfile = Helper::getActionResult("profile", [$username])->payload->profile;
        $this->view->notes = Helper::getActionResult("chats", [$username])->payload->chats;
    }
}