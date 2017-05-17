<?php

/**
 * Helper functions
 *
 * @author kumahacker
 */
class Helper
{
    /**
     * Execute action of ActionController and return decoded result
     *
     * @author kumahacker
     * @param $action
     * @param array $params
     * @return mixed
     */
    static function getActionResult($action, $params = [])
    {
        $controller  = new ActionController();
        ob_start();
        $action = "{$action}Action";
        call_user_func_array([$controller, $action], $params);
        $result = ob_get_contents();
        ob_end_clean();
        return json_decode($result);
    }

    /**
     * Get code of *.phtml templates inside views
     *
     * @author kumahacker
     * @param $path
     * @return string
     */
    static function getTemplate($path)
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
     * @param $tpl
     * @param $data
     * @param string $prefix
     * @param string $suffix
     * @return mixed
     */
    static function replaceTags($tpl, $data = null, $prefix = '', $suffix = '')
    {
        $parses = [];
        if (is_array($tpl))
            $parses = $data;
        else
            $parses[] = [$data, $prefix, $suffix];

        $html = $tpl;

        foreach ($parses as $parse) {
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
     * @param $data
     * @param string $prefix
     * @param string $suffix
     * @return mixed
     */
    static function parseTpl($tplPath, $data, $prefix = '', $suffix = '')
    {
        return self::replaceTags(self::getTemplate($tplPath), $data, $prefix, $suffix);
    }

}