<?php

use Phalcon\Mvc\Controller;

class ActionController extends Controller
{
    public function indexAction()
    {

    }

    public function emailAction($email)
    {
        $result = Api::start($email);
        $this->defaultResponse($result);
    }

    public function loginAction($email, $pin)
    {
        $result = Api::login($email, $pin);

        if ($result->code == "ok")
        {
            $token = $result->token;
            $result = [
                "code" => 200,
                "message" => $token,
                "payload" => []
            ];
            echo json_encode($result);
        }
        else
            $this->defaultResponse($result);
    }

    public function feedAction()
    {
        $result = Api::run("PIZARRA");
        $this->defaultResponse($result);
    }

    public function chatsAction()
    {
        $result = Api::run("NOTA");
        $this->defaultResponse($result);
    }

    public function likeAction($id)
    {
        $result = Api::run("PIZARRA LIKE $id");
        $this->defaultResponse($result);
    }

    public function unlikeAction($id)
    {
        $result = Api::run("PIZARRA UNLIKE $id");
        $this->defaultResponse($result);
    }

    public function followAction($username)
    {
        $result = Api::run("PIZARRA SEGUIR $username");
        $this->defaultResponse($result);
    }

    public function unfollowAction($username)
    {
        $result = Api::run("PIZARRA SEGUIR $username");
        $this->defaultResponse($result);
    }

    public function blockAction($username)
    {
        $result = Api::run("PIZARRA BLOQUEAR $username");
        $this->defaultResponse($result);
    }

    public function unblockAction($username)
    {
        $result = Api::run("PIZARRA DESBLOQUEAR $username");
        $this->defaultResponse($result);
    }

    public function pictureAction()
    {
        $pic = $this->request->get("picture");
        $result = Api::run("PERFIL FOTO", "", $pic);
        $this->defaultResponse($result);
    }

    private function defaultResponse($result)
    {
        switch($result->code)
        {
            case "ok":
                $result = [
                    "code" => 200,
                    "message" => "",
                    "payload" =>  $result
                ];
                break;

            case "error":
                $result = [
                    "code" => 215,
                    "message" => $result->message
                ];
                break;

            case "default":
                $result = [
                    "code" => 500,
                    "message" => $result->message
                ];
        }

        echo json_encode($result);
    }
}