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
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

namespace BaksDev\Core\Controller\User;

use BaksDev\Core\Controller\AbstractController;
use BaksDev\Core\Listeners\Event\Security\RoleSecurity;
use ReflectionAttribute;
use ReflectionClass;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\RouterInterface;

#[AsController]
#[RoleSecurity('ROLE_USER')]
final class RefreshController extends AbstractController
{
    /* Обновление страницы и сброс кеша */
    #[Route('/refresh', name: 'refresh', methods: ['POST', 'GET'])]
    public function refresh(): Response
    {
        return $this->redirectToReferer(status: 307);
    }

    /* редирект на страницу с проверкой доступа по роли */
    #[Route('/redirect', name: 'redirect', methods: ['POST', 'GET'])]
    public function redirect(
        Request $request,
        RouterInterface $router
    ): Response {

        $url = $request->get('url');

        if($url)
        {
            /** Получаем информацию о контроллере */
            $path = parse_url($url, PHP_URL_PATH);
            $routeInfo = $router->match($path);

            $class = substr($routeInfo['_controller'], 0, strpos($routeInfo['_controller'], '::'));

            $ref = new ReflectionClass($class);
            $RoleSecurity = $ref->getAttributes(RoleSecurity::class);


            if($RoleSecurity)
            {
                /** @var ReflectionAttribute $current */
                $current = current($RoleSecurity);

                foreach($current->newInstance()->getRoles() as $role)
                {
                    if($this->isGranted($role))
                    {
                        $route = $routeInfo['_route'];
                        unset($routeInfo['_route']);
                        unset($routeInfo['_controller']);
                        unset($routeInfo['_locale']);


                        return $this->redirectToRoute($route, $routeInfo);
                    }
                }

            }
        }

        return new RedirectResponse('/');
    }
}
