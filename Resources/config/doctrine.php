<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Type\Ip\IpAddress;
use BaksDev\Core\Type\Ip\IpAddressType;
use BaksDev\Core\Type\Locale\Locale;
use BaksDev\Core\Type\Locale\LocaleType;

use BaksDev\Core\Type\Modify\ModifyAction;
use BaksDev\Core\Type\Modify\ModifyActionType;
use Symfony\Config\DoctrineConfig;

return static function(ContainerConfigurator $container, DoctrineConfig $doctrine) {
	
	$doctrine->dbal()->type(ModifyAction::TYPE)->class(ModifyActionType::class);
	$doctrine->dbal()->type(IpAddress::TYPE)->class(IpAddressType::class);
	$doctrine->dbal()->type(Locale::TYPE)->class(LocaleType::class);
	
};