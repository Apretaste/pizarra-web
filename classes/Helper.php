<?php

/**
 * Helper functions
 *
 * @author kumahacker
 */
class Helper
{
	public static $currentProfile = null;

	/**
	 * Singleton for get current profile
	 * @return object
	 */
	public static function getCurrentProfile($force = false)
	{
		if (is_null(self::$currentProfile) || $force == true)
		{
			$di = \Phalcon\DI\FactoryDefault::getDefault();

			$currentProfileSession = null;
			if ($di->getShared("session")->has('profile'))
				$currentProfileSession = $di->getShared("session")->get('profile');

			if (!is_null($currentProfileSession) && $force == false)
				self::$currentProfile = $currentProfileSession;
			else
			{
				$result = self::getActionResult("profile");
				if (isset($result->payload->profile))
					self::$currentProfile = $result->payload->profile;

				$di->getShared("session")->set('profile', self::$currentProfile);
			}
		}

		return self::$currentProfile;
	}

	/**
	 * Execute action of ActionController and return decoded result
	 *
	 * @author kumahacker
	 * @param $action
	 * @param array $params
	 * @return mixed
	 */
	public static function getActionResult($action, $params = [])
	{
		$actionController = new ActionController();
		ob_start();
			call_user_func_array([$actionController, "{$action}Action"], $params);
			$result = ob_get_contents();
		ob_end_clean();
		return json_decode($result);
	}

	/**
	 * Get code of *.phtml templates inside views
	 *
	 * @author kumahacker
	 * @param string $path
	 * @return string
	 */
	public static function getTemplate($path)
	{
		$di = \Phalcon\DI\FactoryDefault::getDefault();
		$www_root = $di->get('path')['root'];
		$tpl = @file_get_contents($www_root . "/app/views/$path.phtml");
		return $tpl;
	}

	/**
	 * Replace {{ tags }} in text
	 *
	 * @author kumahacker
	 *
	 * @param array $parses
	 * @return string
	 */
	public static function replaceTags($tpl, $parses = [])
	{
		$html = $tpl;
		$parses[] = [self::getCurrentProfile(), 'profile.', ''];

		foreach ($parses as $parse)
		{
			$data = $parse[0];
			$prefix = $parse[1];
			$suffix = $parse[2];

			if (is_null($data))
				return $tpl;

			$vars = $data;

			if (is_object($data))
				$vars = get_object_vars($data);

			if (is_scalar(($data)))
				$vars = ["value" => $data];

			foreach ($vars as $tag => $v)
				if (is_scalar($v))
					$html = str_replace("{{ {$prefix}{$tag}{$suffix} }}", $v, $html);
		}

		return $html;
	}

	/**
	 * Load phtml file and replace {{ tags }}
	 *
	 * @author kumahacker
	 * @param $tplPath
	 * @param array $parses
	 * @return string
	 */
	static function parseTpl($tplPath, $parses = [])
	{
		return self::replaceTags(self::getTemplate($tplPath), $parses);
	}

	static function processProfile($profile)
	{
		if (is_object($profile))
		{
			$p = $profile->picture_internal;
			$p = str_replace("\\", "/", $p);
			$p = explode("/", $p);
			$p = $p[count($p) - 1];
			$profile->picture_internal = $p;

			if (!isset($profile->picture_public) || trim($profile->picture_public) == "")
				$profile->picture_public = "/res/images/user.png";
			else
				$profile->picture_public = "/picture/of/$p";
		}
		return $profile;
	}

	static function processProfileFromNote($note)
	{
		if (empty($note->picture)) $note->picture = "/res/images/user.png";
		else $note->picture = "https://apretaste.com/profile/{$note->picture}";
		return $note;
	}

	static function setFlag($flag, $value)
	{
		if ($flag == 'token')
			throw new Exception('don\'t use token flag');

		$di = \Phalcon\DI\FactoryDefault::getDefault();
		$di->getShared("session")->set($flag, $value);
	}

	static function getFlag($flag)
	{
		$di = \Phalcon\DI\FactoryDefault::getDefault();
		return $di->getShared("session")->get($flag);
	}

	static function delFlag($flag)
	{
		if ($flag == 'token')
			throw new Exception('don\'t use token flag');

		$di = \Phalcon\DI\FactoryDefault::getDefault();
		$di->getShared("session")->remove($flag);
	}

	static function hasFlag($flag)
	{
		$di = \Phalcon\DI\FactoryDefault::getDefault();
		return $di->getShared("session")->has($flag);
	}
}
