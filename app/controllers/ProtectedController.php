<?php

use Phalcon\Mvc\Controller;

class ProtectedController extends DefaultController
{
    /**
     * Security check
     *
     * @author kuma
     */
    public function initialize(){

        parent::initialize();

        $di = \Phalcon\DI\FactoryDefault::getDefault();

        if ( ! $di->getShared("session")->has("token"))
        {
            if (isset($_COOKIE['token']) && $_COOKIE['token'] != "")
            {
                // recovery session from cookie
                $di->getShared("session")->set("token", $_COOKIE['token']);

                // renew the cookie
                setcookie("token", $_COOKIE['token'], time() + (3600 * 24 * 7));
            }
            else
                header("Location: /login");
        } else {

            // renew or recovery the cookie from session
            setcookie("token", $di->getShared("session")->get("token"), time() + (3600 * 24 * 7));
        }
    }
}