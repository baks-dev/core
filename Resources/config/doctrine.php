<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use App\Module\Dictionary\Color\Type\Color;
use App\Module\Dictionary\Color\Type\ColorType;
use App\System\Type\Currency\Currency;
use App\System\Type\Currency\CurrencyType;
use App\System\Type\Field\InputField;
use App\System\Type\Field\InputFieldType;
use App\System\Type\Gender\Gender;
use App\System\Type\Gender\GenderType;
use App\System\Type\Ip\IpAddress;
use App\System\Type\Ip\IpAddressType;
use App\System\Type\Locale\Locale;
use App\System\Type\Locale\LocaleType;
use App\System\Type\Measurement\Measurement;
use App\System\Type\Measurement\MeasurementType;
use App\System\Type\Modify\ModifyAction;
use App\System\Type\Modify\ModifyActionType;
use App\System\Type\Money\Money;
use App\System\Type\Money\MoneyType;
use App\System\Type\SettingsMain\Event\SettingsMainEvent;
use App\System\Type\SettingsMain\Event\SettingsMainEventType;
use App\System\Type\SettingsMain\Phone\SettingsMainPhone;
use App\System\Type\SettingsMain\Phone\SettingsMainPhoneType;
use App\System\Type\SettingsMain\SettingsMain;
use App\System\Type\SettingsMain\SettingsMainType;
use App\System\Type\SettingsMain\Social\SettingsMainSocial;
use App\System\Type\SettingsMain\Social\SettingsMainSocialType;
use Symfony\Config\DoctrineConfig;

return static function (ContainerConfigurator $container, DoctrineConfig $doctrine)
{

    
//    $doctrine->dbal()->type(SettingsMain::TYPE)->class(SettingsMainType::class);
//    $doctrine->dbal()->type(SettingsMainEvent::TYPE)->class(SettingsMainEventType::class);
//    $doctrine->dbal()->type(SettingsMainPhone::TYPE)->class(SettingsMainPhoneType::class);
//    $doctrine->dbal()->type(SettingsMainSocial::TYPE)->class(SettingsMainSocialType::class);

    $doctrine->dbal()->type(ModifyAction::TYPE)->class(ModifyActionType::class);
    $doctrine->dbal()->type(IpAddress::TYPE)->class(IpAddressType::class);
    $doctrine->dbal()->type(Locale::TYPE)->class(LocaleType::class);
    $doctrine->dbal()->type(Gender::TYPE)->class(GenderType::class);
    $doctrine->dbal()->type(Color::TYPE)->class(ColorType::class);
    $doctrine->dbal()->type(InputField::TYPE)->class(InputFieldType::class);
    $doctrine->dbal()->type(Money::TYPE)->class(MoneyType::class);
    $doctrine->dbal()->type(Measurement::TYPE)->class(MeasurementType::class);
    $doctrine->dbal()->type(Currency::TYPE)->class(CurrencyType::class);
    
	

    $emDefault = $doctrine->orm()->entityManager('default');
    
    $emDefault->autoMapping(true);
    $emDefault->mapping('System')
      ->type('attribute')
      ->dir('%kernel.project_dir%/src/System/Entity')
      ->isBundle(false)
      ->prefix('App\System\Entity')
      ->alias('System');

};