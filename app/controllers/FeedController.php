<?php
use Phalcon\Mvc\Controller;

class FeedController extends ProtectedController
{
    public function indexAction()
    {
        $this->view->message = false;
        $this->view->notes = Helper::getActionResult("feed")->payload->notes;
        $this->view->profile = Helper::getActionResult("profile")->payload->profile;

        if (Helper::hasFlag("feed.search.results.total"))
        {
            $total = Helper::getFlag("feed.search.results.total");

            if ($total == 0)
            {
                $this->view->message = "No se encontraron notas para el @username, #hashtag o texto que usted busc&oacute;.";
                $this->view->message_type = "danger";
                Helper::delFlag("feed.search.results.total");
            }
        }
    }

    public function searchAction($phrase)
    {
        $this->view->phrase = $phrase;
        $result = Helper::getActionResult('search', [$phrase]);
        $this->view->notes = $result->payload->notes;
        $total = count($this->view->notes);

        Helper::setFlag("feed.search.results.total", $total);
        //Helper::setFlag("feed.search.results", $this->view->notes);
        //Helper::setFlag("feed.search.phrase", $phrase);

        if ($total == 0)
        {
            $this->response->redirect("feed");
        }
    }

}