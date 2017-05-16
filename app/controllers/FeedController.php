<?php

use Phalcon\Mvc\Controller;

class FeedController extends Controller
{
    public function indexAction()
    {
        $di = \Phalcon\DI\FactoryDefault::getDefault();
        if ($di->getShared("session")->has("token")) {
            $token = $di->getShared("session")->get("token");
            $notes = Api::run("PIZARRA", "", "", $token);
            $this->notes = $notes;
            var_dump($notes);
        } else
            $this->response->redirect("login");
    }
}