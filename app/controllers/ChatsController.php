<?php

use Phalcon\Mvc\Controller;

class ChatsController extends ProtectedController
{
    public function indexAction()
    {
        $this->view->notes = Helper::getActionResult("chats")->payload->notes;
        /*$this->view->unread = Api::run("NOTA UNREAD")->items;
        foreach($this->view->unread as $note)
            $note->profile = Helper::processProfile($note->profile);
        */
        if (count($this->view->notes) /*+ count($this->view->unread)*/ == 0)
        {
            Helper::setFlag("message", "No tienes conversaciones. Puedes chatear con cualquiera en Pizarra visitando su perfil.");
            Helper::setFlag("message_type", "info");
            $this->response->redirect("feed");
        }

        $this->view->showSearchButton = false;
        $this->view->showChatsButton = false;
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

        if (count($notes) == 0) // never chat with this user?
        {
            $dynamicNote = new stdClass();
            $dynamicNote->profile = clone $this->view->friendProfile;
            $dynamicNote->profile->picture_public = "/res/images/icon.png";
            $dynamicNote->sent = date("d/m/Y h:i:s");
            $dynamicNote->username = "pizarra";
            $dynamicNote->text = "Te propongo que le cuentes a @{$this->view->friendProfile->username} acerca de ti, seguro le gustar&aacute; conocerte. Abajo hay un espacio para que escribas y un bot&oacute;n para enviar la nota. Ahora los dejo para que conversen.";
            $notes[] = clone $dynamicNote;
            $about = $this->view->friendProfile->about_me;

            $about = str_replace("soy profeso", "profesa", $about);
            $about = str_replace("soy", "es", $about);
            $about = str_replace("tengo", "tiene", $about);
            $about = str_replace("Vivo", "Vive", $about);
            $about = str_replace("estoy", "est&aacute;", $about);
            $about = str_replace("Hola,", "", $about);
            $about = str_replace("mi nombre es", "Su nombre es", $about);
            $about = str_replace("annos", "a&ntilde;os", $about);
            $about = str_replace("trabajo", "trabaja", $about);

            $dynamicNote->text = "Hola soy @pizarra y quisiera presentarte a @{$this->view->friendProfile->username} pues nunca han conversado en este chat. $about";
            $notes[] = clone $dynamicNote;
        }

        $this->view->notes = $notes;
        $this->view->showSearchButton = false;
    }
}