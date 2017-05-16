<?php

class Api {

    static function get($endpoint, $params = [])
    {
        $di = \Phalcon\DI\FactoryDefault::getDefault();
        $config = $di->get('config');

        $url = $config->api->url . $endpoint;
        $c = curl_init($url);
        curl_setopt($c, CURLOPT_POST, true);
        curl_setopt($c, CURLOPT_POSTFIELDS, $params);
        curl_setopt($c, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($c, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($c);
        return json_decode($result);
    }

    static function start($email)
    {
        return self::get("api/start", ["email" => $email]);
    }

    static function login($email, $pin)
    {
        $result = self::get("api/auth", ["email" => $email, "pin" => $pin]);
        if ($result->code == "ok")
        {
            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $di->getShared("session")->set("token", $result->token);
            $di->getShared("session")->set("email", $email);
        }
    }

    static function logout($token)
    {
        return self::get("api/logout", ["token" => $token]);
    }

    static function run($subject, $body = "", $attachment = "")
    {
        $di = \Phalcon\DI\FactoryDefault::getDefault();
        $token = $di->getShared("session")->get("token");

        return self::get("run/api", [
           "subject" => $subject,
           "body" => $body,
           "attachment" => $attachment,
           "token" => $token
        ]);
    }
}