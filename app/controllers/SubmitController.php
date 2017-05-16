<?php

use Phalcon\Mvc\Controller;

class SubmitController extends Controller
{
    public function indexAction()
    {

    }

    public function publishAction($text)
    {
        Api::run("PIZARRA $text");
        $this->response->redirect("feed");
    }

    public function chatAction($username, $text)
    {
        $result = Api::run("NOTA $username $text");
        $this->response->redirect("chats/$username");
    }

    public function profileAction($bulk)
    {
        $result = Api::run("PERFIL BULK $bulk");
        $this->response->redirect("profile");
    }
}