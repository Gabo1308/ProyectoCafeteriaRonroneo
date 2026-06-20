<?php

class Logger
{
    private $logpath;
    
    public function __construct() {
        $this->logpath=Config::get('LOG_PATH');
    }
    public function log($level, $message, array $context = []): void
    {
        // Current date in 1970-12-01 23:59:59 format
        $dateFormatted = (new \DateTime())->format('d-m-Y H:i:s');

        // Build the message with the current date, log level, 
        // and the string from the arguments
        
        $user=preg_replace('/\r\n|\r|\n/', '',shell_exec("echo %username%"));
        $message = sprintf(
            '[%s] [%s] %s: %s%s ',
            $dateFormatted,$user,
            $level,
            $message,
            PHP_EOL // Line break
        );
        $dateF = (new \DateTime())->format('d-m-Y');
        if (!is_dir($this->logpath)) {
            mkdir($this->logpath, 0777, true);
        }
        $logfilename = $this->logpath."/log-$dateF.log";
        file_put_contents($logfilename , $message, FILE_APPEND);
        
        
    }
    public function emergency($message, array $context = []): void
    {
        $this->log('emergency', $message, $context);
    }

    public function alert($message, array $context = []): void
    {
        $this->log('alert', $message, $context);
    }
    public function critical($message, array $context = []): void
    {
        $this->log('critical', $message, $context);
    }
    public function warning($message, array $context = []): void
    {
        $this->log('warning', $message, $context);
    }
    public function notice($message, array $context = []): void
    {
        $this->log('notice', $message, $context);
    }
    public function info($message, array $context = []): void
    {
        $this->log('info', $message, $context);
    }
    public function debug($message, array $context = []): void
    {
        $this->log('debug', $message, $context);
    }
    public function error($message, array $context = []): void
    {
        $this->log('error', $message, $context);
    }
}
