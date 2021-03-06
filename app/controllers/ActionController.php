<?php

use Phalcon\Mvc\Controller;

class ActionController extends Controller
{
	public function submitPublishAction($text)
	{
		$result = Api::run("PIZARRA $text");
		$this->defaultResponse($result);
	}

	public function submitCommentAction($note, $text)
    {
        $note = intval($note);
        $result = Api::run("PIZARRA $note* $text");
        $this->defaultResponse($result);
    }

	public function submitChatAction($username, $text)
	{
		$result = Api::run("NOTA $username $text");
		$this->defaultResponse($result);
	}

	public function submitProfileAction($bulk)
	{
		$bulk = base64_decode($bulk);

		$result = Api::run("PERFIL BULK $bulk");

		Helper::getCurrentProfile(true);

		$this->defaultResponse($result);
	}

	public function emailAction()
	{
		$email = $this->request->get('email');

		$result = Api::start($email);
		$this->defaultResponse($result);
	}

	public function loginAction()
	{
		$email = $this->request->get('email');
		$pin = $this->request->get('pin');

		$result = Api::login($email, $pin);

		if ($result->code == "ok")
		{
			$token = $result->token;
			$result = [
				"code" => 200,
				"message" => $token,
				"payload" => []
			];

			setcookie("token", $token, time() + (3600*24*7));

			echo json_encode($result);
		}
		else $this->defaultResponse($result);
	}

	public function feedAction()
	{
		$result = Api::run("PIZARRA");
		$currentProfile = Helper::getCurrentProfile();

		if (isset($result->notes)) foreach($result->notes as $note)
		{
			$note = Helper::processProfileFromNote($note);
			$note->hideOwnLinks = $note->username == $currentProfile->username? "hidden" : "";
			$note->followcolor = $note->friend==true ? 'red' : 'black';
			$note->inserted = Helper::getPerfectDate($note->inserted);
			$note->isliked = $note->isliked ? "is-liked": "non-liked";
			$note->country = strtolower($note->country);
			if (!isset($note->gender))
			{
                $note->gender = "male";
                if (isset($note->profile))
                    $note->gender = $note->profile->gender;
            }
            $note->gender = strtolower($note->gender[0]) == 'f' ? 'female': 'male';
		}

		$this->defaultResponse($result);
	}

	public function chatsAction($username = null)
	{
		$result = Api::run("NOTA $username");

		if (isset($result->chats)) $result->notes = $result->chats;
		if (!isset($result->notes)) $result->notes = [];

		$new_result = [];
		foreach($result->notes as $note)
		{
			if (isset($note->profile)) $note->profile = Helper::processProfile($note->profile);
			elseif (isset($note->username)) $note->profile = Helper::getActionResult("profile", [$note->username])->payload->profile;
			if ( ! isset($note->profile)) continue;
			if (empty($note->username)) continue;
			$new_result[] = $note;
		}

		$result->notes = $new_result;
		$this->defaultResponse($result);
	}

	public function unreadAction()
	{
		$result = Api::run("NOTA UNREAD");
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

		// to know the location of saved picture in the server
		Helper::getCurrentProfile(true);

		$this->defaultResponse($result);
	}

	public function profileAction($username = '')
	{
		$result = Api::run("PERFIL $username");

		if (isset($result->profile))
			$result->profile = Helper::processProfile($result->profile);

		$this->defaultResponse($result);
	}

	public function searchAction($phrase)
	{
		$result = Api::run("PIZARRA BUSCAR $phrase");

		if (empty($result->notes)) $result->notes = [];

		foreach($result->notes as $note){
			$note = Helper::processProfileFromNote($note);
		}

		$this->defaultResponse($result);
	}

	public function noteAction($id)
    {
        $currentProfile = Helper::getCurrentProfile();
        $result = Api::run("PIZARRA NOTA $id");
        $note = $result->note;
        $note = Helper::processProfileFromNote($note);
        $note->hideOwnLinks = $note->username == $currentProfile->username? "hidden" : "";
        $note->followcolor = $note->friend==true ? 'red' : 'black';
        $note->inserted = Helper::getPerfectDate($note->inserted);
        if (!isset($note->gender))
        {
            $note->gender = "male";
            if (isset($note->profile))
                $note->gender = $note->profile->gender;
        }
        $note->gender = strtolower($note->gender[0]) == 'f' ? 'female': 'male';

        if (isset($note->comments))
            if (is_array($note->comments))
                foreach($note->comments as $comment)
                {
                    $comment = Helper::processProfileFromNote($comment);
                    $comment->gender = strtolower($comment->gender[0]) == 'f' ? 'female': 'male';
                    if (stripos($comment->picture, '.jpg') === false && stripos($comment->picture, '.png') === false);
                        $comment->picture .= ".jpg";

                }
        $result->note = $note;


        $this->defaultResponse($result);
    }

	//@NOTE added by Salvi
	public function updateAppIdAction()
	{
		$appid = $this->request->get('appid');
		$result = Api::updateappid($appid);
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
