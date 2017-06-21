<?php

use Phalcon\Mvc\Controller;

class LoginController extends Controller
{
	public function indexAction()
	{
		$this->view->setLayout('login');
	}
}
