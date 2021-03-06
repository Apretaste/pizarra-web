<?php
use Phalcon\Mvc\Controller;

class FeedController extends ProtectedController
{
	public function indexAction()
	{
		$result = Helper::getActionResult("feed");
		$this->view->profile = Helper::getCurrentProfile();

		if (isset($result->payload->notes))
		{

		    $this->view->notes = $result->payload->notes;
			$this->view->showRefreshButton = true;
			$this->view->showCloseButton = false;
			$this->view->closeLink = "/logout";
		}
		else
		{
			$this->response->redirect("logout");
		}
	}

	public function searchAction($phrase)
	{
		$this->view->phrase = $phrase;
		$result = Helper::getActionResult('search', [$phrase]);

		$total = 0;

		if (isset($result->payload->notes))
		{
			$this->view->notes = $result->payload->notes;
			$total = count($this->view->notes);
		}

		if ($total == 0)
		{
			Helper::setFlag("message", "No se encontraron notas para el @username, #hashtag o texto que usted busc&oacute;.");
			Helper::setFlag("message_type", "danger");
			$this->response->redirect("feed");
		}
	}
}
