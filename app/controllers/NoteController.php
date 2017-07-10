<?php

use Phalcon\Mvc\Controller;

class NoteController extends ProtectedController
{

    public function indexAction()
    {
        $url = $this->request->getURI();
        $url = explode("/", $url);
        $id = intval($url[count($url)-1]);
        $result = Helper::getActionResult("note", ["id" => $id])->payload;

        $this->view->showRefreshButton = false;
        $this->view->showSearchButton = false;
        $this->view->showProfileButton = false;
        $this->view->showChatsButton = false;
        $this->view->noteId = $id;
        $this->view->note = $result->note;
    }
}