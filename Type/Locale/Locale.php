<?php

namespace BaksDev\Core\Type\Locale;

use Doctrine\Common\Collections\ArrayCollection;

/** Локализация  */
final class Locale
{
    public const TYPE = 'locale';
    
    //final const DEFAULT_LOCALE = 'ru';
    //final const FALLBACKS_LOCALE = ['en'];
    
    private LocaleEnum $locale;
    

    public function __construct(string|LocaleEnum|Locale $locale)
    {
        if($locale instanceof LocaleEnum)
        {
            $this->locale = $locale;
        }
        else
        {
            $this->locale = LocaleEnum::from($locale);
        }
    }
    
    public function __toString() : string
    {
        return $this->locale->value;
    }
    
    /**
     * @return string
     */
    public function getValue() : string
    {
        return $this->locale->value;
    }
    
    /**
     * @return string
     */
    public function getName() : string
    {
        return $this->locale->name;
    }
    
    public static function cases() : array
    {
        $case = null;
        
        foreach(LocaleEnum::cases() as $local)
        {
            $case[] = new self($local);
        }
        
        return $case;
    }
    
    public static function routes() : array
    {
        $routes = null;
        
        foreach(LocaleEnum::cases() as $case)
        {
            if($case->value === LocaleEnum::DEFAULT_LOCALE)
            {
                $routes[$case->value] = '';
                continue;
            }
            
            $routes[$case->value] = '/'.$case->value;
        }
        
        return $routes;
    }
    
  
    public static function diffLocale(ArrayCollection|array $diffArray, string $column_key = 'local')
    {
        $search = [];
        
        foreach($diffArray as $item)
        {
            $search[] = $item->getLocal();
        }
        
        /* Вычисляем расхождение массивов */
        return array_diff(self::cases(), $search);
    }
    
}