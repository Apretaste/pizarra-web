<?php
use Phalcon\Mvc\Controller;

class FeedController extends ProtectedController
{
    public function indexAction()
    {
        //$this->assets->addJs("res/notes.js");
        $this->view->notes = $this->getActionResult("feed")->payload->notes;
    }
}