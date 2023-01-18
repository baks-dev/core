<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *
 */

namespace BaksDev\Core\Services\Security;

use Exception;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerArgumentsEvent;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class SecuritySubscriber implements EventSubscriberInterface
{
	
	private TokenStorageInterface $storage;
	
	public function __construct(TokenStorageInterface $storage)
	{
		$this->storage = $storage;
	}
	
	public static function getSubscribedEvents()
	{
		return [
			KernelEvents::CONTROLLER_ARGUMENTS => ['onKernelControllerArguments'],
		];
	}
	
	public function onKernelControllerArguments(ControllerArgumentsEvent $event)
	{
		if(!\is_array($attributes = $event->getAttributes()[RoleSecurity::class] ?? null))
		{
			return;
		}
		
		$token = $this->storage->getToken();
		
		if(!$token)
		{
			throw new AccessDeniedException();
		}
		
		$user = $token->getUser();
		
		if(!$user)
		{
			throw new AccessDeniedException();
		}
		
		$roles = $user->getRoles();
		
		if(empty($roles))
		{
			throw new AccessDeniedException();
		}

		$granted = current($attributes)->getRoles();
		
		$commonRoles = array_intersect(
			$roles,
			$granted
		);
		
		if(empty($commonRoles)) {
			throw new AccessDeniedException();
		}
	}
}