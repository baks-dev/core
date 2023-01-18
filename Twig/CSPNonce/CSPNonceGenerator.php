<?php

namespace BaksDev\Core\Twig\CSPNonce;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class CSPNonceGenerator  extends AbstractExtension
{
    /** @var String|null */
    private ?string $nonce = null;
    
    public function getFunctions() : array
    {
        return [
          new TwigFunction('csp_nonce', [$this, 'getNonce']),
        ];
    }
    
    public function getNonce() : string
    {
        if ($this->nonce === null) {
            $this->nonce = base64_encode(random_bytes(20));
        }
        
        return $this->nonce;
    }
}