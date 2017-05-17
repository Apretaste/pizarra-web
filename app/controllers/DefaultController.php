<?php

use Phalcon\Mvc\Controller;

class DefaultController extends Controller
{
    public function initialize(){
        $this->view->setLayout('index');
    }

    public function indexAction()
    {
        $this->response->redirect("/feed");
    }

    public function getActionResult($action, $params = [])
    {
        $controller  = new ActionController();
        ob_start();
        $action = "{$action}Action";
        call_user_func_array([$controller, $action], $params);
        $result = ob_get_contents();
        ob_end_clean();
        return json_decode($result);
    }
}