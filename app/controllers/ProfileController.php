<?php

use Phalcon\Mvc\Controller;

class ProfileController extends ProtectedController
{
    public function indexAction($username = null)
    {

    }
    public function ofAction($username = '')
    {
        if (is_null($username))
            $profile = Helper::getCurrentProfile();
        else
            $profile = Helper::getActionResult("profile", [$username])->payload->profile;

        $this->view->profile = $profile;

    }
}