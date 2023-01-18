<?php

namespace BaksDev\Core\Twig\CSPNonce;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class CSPNonceSubscriber implements EventSubscriberInterface
{

    private CSPNonceGenerator $CSPNonceGenerator;
    
    public function __construct(CSPNonceGenerator $CSPNonceGenerator )
    {
        $this->CSPNonceGenerator = $CSPNonceGenerator;
    }
    
    public function onKernelResponse(ResponseEvent $event)
    {
        $response = $event->getResponse();
        $nonce = $this->CSPNonceGenerator->getNonce();
        
        //{#<meta http-equiv="Content-Security-Policy" content="script-src 'nonce-{{ random }}' 'self' 'strict-dynamic' 'unsafe-inline' https:; object-src 'none'; base-uri 'none';">#}
        $cspHeader = "script-src 'nonce-" . $nonce . "' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https:; object-src 'none'; base-uri 'none';";
   
        $response->headers->set("Content-Security-Policy", $cspHeader);
        
    }
    
    public static function getSubscribedEvents()
    {
        return [
          KernelEvents::RESPONSE => 'onKernelResponse',
        ];
    }
}