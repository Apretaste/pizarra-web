<?php
use Phalcon\Mvc\Controller;

class ProxyController extends Controller
{
    public function indexAction($c, $a)
    {
        $result = Api::get("$c/$a", $_POST);
        echo json_encode($result);
    }

    public function apiAction($a)
    {
        return $this->indexAction("api", $a);
    }

    public function runAction($a)
    {
        return $this->indexAction("run", $a);
    }
}