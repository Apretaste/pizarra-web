<?php
use Phalcon\Mvc\Controller;

class FeedController extends ProtectedController
{
    public function indexAction()
    {
        $this->view->notes = Helper::getActionResult("feed")->payload->notes;
        $this->view->profile = Helper::getActionResult("profile")->payload->profile;
        $this->view->closeLink = "/logout";
    }

    public function searchAction($phrase)
    {
        $this->view->phrase = $phrase;
        $result = Helper::getActionResult('search', [$phrase]);
        $this->view->notes = $result->payload->notes;
        $total = count($this->view->notes);

        if ($total == 0)
        {
            Helper::setFlag("message", "No se encontraron notas para el @username, #hashtag o texto que usted busc&oacute;.");
            Helper::setFlag("message_type", "danger");
            $this->response->redirect("feed");
        }
    }
}