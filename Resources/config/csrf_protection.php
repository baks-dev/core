<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework) {
	$framework->csrfProtection()
		->enabled(true)
	;
	
	$framework->session()
		->enabled(true)
		// ID of the service used for session storage
		// NULL means that Symfony uses PHP default session mechanism
		//->handlerId(null)
		
		// повышает безопасность файлов cookie
		->cookieSecure('auto')
		->cookieSamesite(Cookie::SAMESITE_LAX)
		->storageFactoryId('session.storage.factory.native')
	;
	
};
