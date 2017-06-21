<?php

class Api
{
	static function curl($endpoint, $params = [])
	{
		$di = \Phalcon\DI\FactoryDefault::getDefault();
		$config = $di->get('config');

		$url = $config->api->url . $endpoint;
		$c = curl_init($url);

		if (count($params) > 0)
		{
			curl_setopt($c, CURLOPT_POST, true);
			curl_setopt($c, CURLOPT_POSTFIELDS, $params);
		}

		curl_setopt($c, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($c, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
		$result = curl_exec($c);

		return $result;
	}

	static function get($endpoint, $params = [])
	{
		$result = self::curl($endpoint, $params);
		return json_decode($result);
	}

	static function start($email)
	{
		$result = self::get("api/start", ["email" => $email]);
		return $result;
	}

	static function login($email, $pin)
	{
		$result = self::get("api/auth", ["email" => $email, "pin" => $pin, "appname" => "pizarra"]);

		if ($result->code == "ok")
		{
			$di = \Phalcon\DI\FactoryDefault::getDefault();
			$di->getShared("session")->set("token", $result->token);
			$di->getShared("session")->set("email", $email);
			Helper::getCurrentProfile(true);
		}
		return $result;
	}

	static function logout($token)
	{
		return self::get("api/logout", ["token" => $token]);
	}

	static function run($subject, $body = "", $attachment = "")
	{
		$di = \Phalcon\DI\FactoryDefault::getDefault();
		$token = $di->getShared("session")->get("token");

		$result = self::get("run/api", [
			"subject" => $subject,
			"body" => $body,
			"attachment" => $attachment,
			"token" => $token
		]);

		if ( ! is_object($result))
			$result = new stdClass();

		if ( ! isset($result->code))
			$result->code = "error";

		if ( ! isset($result->message))
			$result->message = '';

		return $result;
	}
}
