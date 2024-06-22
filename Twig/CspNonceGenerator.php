<?php

namespace BaksDev\Core\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class CspNonceGenerator extends AbstractExtension
{
    private ?string $nonce = null;

    /**
     * генерирует значение nonce для Content-Security-Policy Header
     */

    public function getFunctions(): array
    {
        return [
            new TwigFunction('csp_nonce', $this->getNonce(...)),
        ];
    }

    public function getNonce(): string
    {
        if(null === $this->nonce)
        {
            $this->nonce = base64_encode(random_bytes(20));
        }

        return $this->nonce;
    }
}
