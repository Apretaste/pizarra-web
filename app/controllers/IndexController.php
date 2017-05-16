<?php

use Phalcon\Mvc\Controller;

class IndexController extends Controller
{
	public function indexAction()
	{
        // check if the user is logged, else redirect
        $di = \Phalcon\DI\FactoryDefault::getDefault();

        if ( ! $di->getShared("session")->has("manager"))
        {
            header("Location: /login");
        }

		//$r = Api::run("api/auth", ["email" => "html@apretaste.com", "pin" => "1234"]);

	}
}
