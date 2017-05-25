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

        $this->view->showSearchButton = false;
    }

    public function withAction($username = null)
    {
        $profile = Helper::getCurrentProfile();

        if ($profile->username == $username) // chat with yourself?
            header("Location: /feed");

        $result = Helper::getActionResult("profile", [$username]);

        if ($result->code == 215)  // user not exists?
            header("Location: /feed");

        $this->view->friendProfile = $result->payload->profile;
        $notes = Helper::getActionResult("chats", [$username])->payload->notes;

        if (count($this->view->notes) == 0) // never chat with this user?
        {
            $dynamicNote = new stdClass();
            $dynamicNote->profile = $this->view->friendProfile;
            $dynamicNote->sent = date("d/m/Y h:i:s");
            $dynamicNote->username = $this->view->friendProfile->username;
            $dynamicNote->text = "Ahora cu&eacute;ntame de ti, ser&aacute; un placer conocerte.";
            $notes[] = clone $dynamicNote;
            $dynamicNote->text = $this->view->friendProfile->about_me;
            $notes[] = clone $dynamicNote;
        }

        $this->view->notes = $notes;
        $this->view->showSearchButton = false;
    }
}