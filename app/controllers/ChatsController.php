<?php

use Phalcon\Mvc\Controller;

class ChatsController extends Controller
{
    public function indexAction($username = null)
    {
        if (is_null($username))
        {
            echo "ultimos chats";
        } else
            echo "chats con $username";

    }
}