<?php

use Phalcon\Mvc\Controller;

class ChatsController extends ProtectedController
{
	public function indexAction()
	{
		// load list of open chats
		$result = Helper::getActionResult("chats");
		$notes = $result->code == "200" ? $result->payload->notes : [];

		// if there are no chats, show info message
		if (empty($notes))
		{
			Helper::setFlag("message", "No tienes conversaciones. Puedes chatear con cualquiera en Pizarra visitando su perfil.");
			Helper::setFlag("message_type", "info");
			$this->response->redirect("feed");
		}

		// send information to the view
		$this->view->notes = $notes;
		$this->view->showSearchButton = false;
		$this->view->showChatsButton = false;
	}

	public function withAction($username = null)
	{
		$profile = Helper::getCurrentProfile();

		// chat with yourself?
		if ($profile->username == $username) header("Location: /feed");

		$result = Helper::getActionResult("profile", [$username]);

		// user not exists?
		if ($result->code == 215) header("Location: /feed");

		$this->view->friendProfile = $result->payload->profile;
		$notes = Helper::getActionResult("chats", [$username])->payload->notes;

		if (count($notes) == 0) // never chat with this user?
		{
			$dynamicNote = new stdClass();
            $dynamicNote->dynamic = "dynamic";
			$dynamicNote->profile = clone $this->view->friendProfile;
			$dynamicNote->profile->picture_public = "/res/images/icon.png";
			$dynamicNote->sent ="";
			$dynamicNote->username = "pizarra";
			$dynamicNote->text = "Hola soy @pizarra y quisiera presentarte a @{$this->view->friendProfile->username} pues nunca han conversado en este chat. Cu&eacute;ntale a  @{$this->view->friendProfile->username} acercad e ti. M&aacute;s abajo hay un espacio prara que escribas y un bot&oacute;n para enviar. Ahora los dejo solos para que conversen.";
			$notes[] = clone $dynamicNote;
		} else foreach($notes as $note) $note->dynamic = "";

		$this->view->notes = $notes;
		$this->view->showSearchButton = false;
	}
}
