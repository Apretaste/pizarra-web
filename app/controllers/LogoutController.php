<?php

use Phalcon\Mvc\Controller;

class LogoutController extends Controller
{
	public function indexAction()
	{
		$di = \Phalcon\DI\FactoryDefault::getDefault();
		$di->getShared("session")->remove("token");
		$di->getShared("session")->remove("email");
		$di->getShared("session")->remove("profile");
		setcookie("token", "", time() - 3600);
		unset($_COOKIE['token']);
		header("Location: /login");
	}
}
