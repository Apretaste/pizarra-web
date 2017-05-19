<?php

use Phalcon\Mvc\Controller;

class PictureController extends Controller
{
    public function indexAction(){
        
    }

    public function ofAction($filename = '')
    {
        if ($filename == '' || $filename == "user.png" || $filename == "/res/images/user.png")
            $img = file_get_contents("res/image/user.png");
         else
             $img = Api::curl("profile/$filename");

        header("Content-type: image/jpg");

        echo $img;

        $this->view->disable();
    }
}
