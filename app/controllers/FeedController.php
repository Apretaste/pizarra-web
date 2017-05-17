<?php
use Phalcon\Mvc\Controller;

class FeedController extends ProtectedController
{
    public function indexAction()
    {
        //$this->assets->addJs("res/notes.js");
        $this->view->notes = Helper::getActionResult("feed")->payload->notes;
    }
}