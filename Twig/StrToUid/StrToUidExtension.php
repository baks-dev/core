<?php

namespace BaksDev\Core\Twig\strToUid;

use Symfony\Component\Uid\Uuid;
use Twig\Environment;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;


/** Преобразовывает стровку в UID  */
final class StrToUidExtension extends AbstractExtension
{
	public function getFunctions(): array
	{
		return [
			new TwigFunction('uid', [$this, 'toUid'], ['needs_environment' => true, 'is_safe' => ['html']]),
		];
	}
	
	public function toUid(Environment $twig, $value = null)
    {
        if($value === null)
        {
            $value = Uuid::v4();
        }
        
        /* Применяем фильтр для перехода в режим пользователя */
        if(!preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $value))
        {
            return null;
        }
    
        if(is_string($value))
        {
            $value = new Uuid($value);
        }
    
        return (string) $value;
        
       //dd($action);
        
        //return $twig->render('@ModifyAction/modify.html.twig', ['action' => 'modify.'.$action]);
	}
}