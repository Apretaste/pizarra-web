<?php
use Phalcon\Mvc\Controller;

class FeedController extends ProtectedController
{
    public function indexAction()
    {
        $this->view->notes = Helper::getActionResult("feed")->payload->notes;
        $this->view->profile = Helper::getActionResult("profile")->payload->profile;
    }
}