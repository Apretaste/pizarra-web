<?php

use Phalcon\Mvc\Controller;

class SubmitController extends Controller
{
    public function indexAction()
    {

    }

    public function publishAction($text)
    {
        $result = Helper::getActionResult("submitPublish", [$text]);
        $this->response->redirect("feed");
        return $result;
    }

    public function chatAction($username, $text)
    {
        $text = substr($text, 1, 130);
        $result = Helper::getActionResult("submitChat", [$username, $text]);
        $this->response->redirect("chats/$username");
        return $result;
    }

    public function profileAction($bulk)
    {
        $result = Helper::getActionResult("submitProfile", [$bulk]);
        $this->response->redirect("profile");
        return $result;
    }
}