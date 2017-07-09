<?php

use Phalcon\Mvc\Controller;

class ProfileController extends ProtectedController
{
    public function initialize()
    {
        parent::initialize();
    }

    public function indexAction($username = null)
    {
        $this->view->showSearchButton = false;
        $this->view->showProfileButton = false;
    }
    public function ofAction($username = '')
    {
        $this->view->showSearchButton = false;

        if (is_null($username))
            $profile = Helper::getCurrentProfile();
        else
        {
            $profile = Helper::getActionResult("profile", [$username])->payload->profile;
            if (is_null($profile))
                header("Location: /feed");
        }
        $this->view->profile = $profile;

    }
}