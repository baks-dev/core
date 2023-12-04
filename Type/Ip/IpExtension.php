<?php

namespace BaksDev\Core\Type\Ip;

use Twig\Environment;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class IpExtension extends AbstractExtension
{
	public function getFunctions() : array
	{
		return [
			new TwigFunction('user_ip', [$this, 'userIp'], ['needs_environment' => true]),
		];
	}
	
	
	public function userIp(Environment $twig, int $ip): string
	{
		return long2ip($ip);
	}
	
}