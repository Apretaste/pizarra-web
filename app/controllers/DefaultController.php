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

    public function getTemplate($path)
    {
        $di = \Phalcon\DI\FactoryDefault::getDefault();
        $www_root = $di->get('path')['root'];
        $tpl = @file_get_contents($www_root . "/app/views/$path.phtml");
        return $tpl;
    }

    public function replaceTags($tpl, $data, $prefix = '', $suffix = '')
    {
        $html = $tpl;
        $vars = get_object_vars($data);

        foreach($vars as $tag => $v)
            $html = str_replace("{{ {$prefix}{$tag}{$suffix} }}", $v, $html);

        return $html;
    }

    public function parseTpl($tplPath, $data, $prefix = '', $suffix = '')
    {
        return $this->replaceTags($this->getTemplate($tplPath), $data, $prefix, $suffix);
    }
}