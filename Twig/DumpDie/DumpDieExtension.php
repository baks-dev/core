<?php

namespace BaksDev\Core\Twig\DumpDie;

use Twig\Environment;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class DumpDieExtension extends AbstractExtension
{
    public function getFunctions() : array
    {
        return [
          new TwigFunction('dd', [$this, 'toArray'], ['needs_environment' => true, 'is_safe' => ['html']]),
        ];
    }
    
    public function toArray(Environment $twig, $action = null)
    {
        dd($action);
    }
    
}