<?php
/*
 *  Copyright 2022.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

namespace BaksDev\Core\Controller;

use BaksDev\Core\Cache\CacheCss\CacheCssInterface;
use BaksDev\Core\Type\Locale\Locale;
use BaksDev\Settings\Main\Repository\SettingsMain\SettingsMainInterface;
use BaksDev\Users\Profile\UserProfile\Type\Id\UserProfileUid;
use BaksDev\Users\User\Entity\User;
use BaksDev\Users\User\Type\Id\UserUid;
use LogicException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Exception\SessionNotFoundException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\SwitchUserToken;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment;

abstract class AbstractController
{

    private RouterInterface $router;

    private AuthorizationCheckerInterface $authorizationChecker;

    private Environment $environment;

    private RequestStack $requestStack;

    private TokenStorageInterface $tokenStorage;

    private FormFactoryInterface $formFactory;

    private TranslatorInterface $translator;

    private SettingsMainInterface $getSettingsMain;

    private string $project_dir;
    private CacheCssInterface $cacheCss;


    public function __construct(
        #[Autowire('%kernel.project_dir%')] string $project_dir,
        RouterInterface $router,
        AuthorizationCheckerInterface $authorizationChecker,
        Environment $environment,
        RequestStack $requestStack,
        FormFactoryInterface $formFactory,
        TranslatorInterface $translator,
        TokenStorageInterface $tokenStorage,
        SettingsMainInterface $getSettingsMain,
        CacheCssInterface $cacheCss
    )
    {
        $this->authorizationChecker = $authorizationChecker;
        $this->environment = $environment;
        $this->requestStack = $requestStack;
        $this->tokenStorage = $tokenStorage;
        $this->formFactory = $formFactory;
        $this->translator = $translator;
        $this->getSettingsMain = $getSettingsMain;
        $this->router = $router;
        $this->project_dir = $project_dir;
        $this->cacheCss = $cacheCss;
    }


    public function contentMinify(string $body)
    {
        //return $body;

        $replace = [
            // удалить вкладки до и после тегов HTML
            '/\>[^\S ]+/s' => '>',
            '/[^\S ]+\</s' => '<',

            // сократить несколько последовательностей пробелов; сохраняйте символы новой строки, потому что они имеют значение в JS!!!
            '/([\t ])+/s' => ' ',

            // удалить начальные и конечные пробелы
            '/^([\t ])+/m' => '',
            '/([\t ])+$/m' => '',

            // удалить комментарии строки JS (только простые); НЕ удаляйте строки, содержащие URL (e.g. 'src="http://server.com/"')!!!
            // '~//[a-zA-Z0-9 ]+$~m' => '',

            // удалить пустые строки (последовательность символов конца строки и пробелов)
            '/[\r\n]+([\t ]?[\r\n]+)+/s' => "\n",

            // удалить пустые строки (между тегами HTML); не может удалить любые символы конца строки, потому что во встроенном JS они могут иметь значение!
            '/\>[\r\n\t ]+\</s' => '><',

            // удалить «пустые» строки, содержащие только символ конца блока JS; присоединиться к следующей строке (например, "}\n}\n<script>" --> "}}<script>"
            '/}[\r\n\t ]+/s' => '}',
            '/}[\r\n\t ]+,[\r\n\t ]+/s' => '},',

            // удалить новую строку после запуска функции или условия JS; присоединиться к следующей строке
            '/\)[\r\n\t ]?{[\r\n\t ]+/s' => '){',
            '/,[\r\n\t ]?{[\r\n\t ]+/s' => ',{',

            // удалить новую строку после конца строки JS (только самые очевидные и безопасные случаи)
            // '/\),[\r\n\t ]+/s' => '),',

            // удалить кавычки из HTML-атрибутов, не содержащих пробелов; держите URL-адреса в кавычках!
            '~([\r\n\t ])?([a-zA-Z0-9]+)="([a-zA-Z0-9_/\\-]+)"([\r\n\t ])?~s' => '$1$2=$3$4',

            // 1 и 4 вставляют первый найденный символ пробела до и после атрибута
        ];

        $body = preg_replace(array_keys($replace), array_values($replace), $body);

        // Удалить необязательные закрывающие теги (см. http://www.w3.org/TR/html5/syntax.html#syntax-tag-omission )
        $remove = [
            '</option>',
            '</li>',
            '</dt>',
            '</dd>',
            '</tr>',
            '</th>',
            '</td>',
            '</thead>',
            '</tbody>',
        ];


        return str_ireplace($remove, '', $body);
    }


    public function settings(): ?array
    {
        $request = $this->requestStack;

        $host = $request->getCurrentRequest()
            ?->getHost();
        $lang = $request->getCurrentRequest()
            ?->getLocale(); // присваиваем локаль

        return $this->getSettingsMain->getSettingsMainAssociative($host, $lang);
    }


    /** Добавляет сообщение пользователю постпредством сессий */
    public function addFlash(
        string $type,
        mixed $message,
        string $domain = 'messages',
        array|string|object $arguments = null,
        int $status = 302
    ): ?Response
    {

        if(is_object($arguments))
        {
            $arguments = null;
        }

        if($message)
        {
            try
            {
                if($domain)
                {


                    $message = $this->translator->trans($message, [], $domain);



                    if($arguments !== null)
                    {
                        if(is_array($arguments))
                        {
                            foreach($arguments as $argument)
                            {
                                $message = sprintf($message, $argument);
                            }
                        }
                        else
                        {

                            $argumentTranslate = $this->translator->trans($arguments, [], $domain);

                            if($argumentTranslate !== $arguments)
                            {
                                /** Присваиваем сообщение из аргумента */
                                $message = $argumentTranslate;
                            }
                            else
                            {
                                /** Меняем значение %s на аргумент */
                                $message = sprintf($message, $arguments);
                            }
                        }
                    }
                }

                $label = $this->translator->trans($type, [], $domain);


                if($status != 302 && $this->requestStack->getMainRequest()?->isXmlHttpRequest())
                {
                    return new JsonResponse(
                        [
                            'type' => 'success',
                            'status' => $status,
                            'header' => $label,
                            'message' => $message,
                            'arguments' => is_array($arguments) ? json_encode($arguments) : $arguments,
                        ], status: $status
                    );
                }

                $this->requestStack->getSession()
                    ->getFlashBag()
                    ->add($label, $message);
            }
            catch(SessionNotFoundException $e)
            {
                throw new LogicException(
                    'You cannot use the addFlash method if sessions are disabled. Enable them in "config/packages/framework.yaml".',
                    0,
                    $e
                );
            }
        }

        return null;
    }


    public function getLocale(): Locale
    {
        return new Locale($this->translator->getLocale());
    }


    /**
     * Проверяем, имеется ли у пользователя соответствующая роль */
    protected function isGranted(mixed $attribute, mixed $subject = null): bool
    {
        return $this->authorizationChecker->isGranted($attribute, $subject);
    }


    /**
     *
     * Отображает шаблон
     *
     * @param array $parameters - передаваемые шаблону параметры
     * @param string|null $fileName - нейминг роута файла
     * @param string|null $moduleTemplateName
     * @param string|null $template
     * @param Response|null $response
     */
    protected function render(
        array $parameters = [],
        bool|string $module = false,
        string $routingName = null,
        string $file = null,
        Response $response = null,
    ): Response
    {

        $request = $this->requestStack;

        $route = $request->getCurrentRequest()->attributes->get('_route');

        if(!$module)
        {
            $exp = explode(':', $route);
            $module = current($exp) ?: $module;
        }

        $moduleTemplateName = '@'.$module;


        // Если не задан нейминг роутинга - присваиваем из префикса роутинга
        if(!$routingName)
        {
            $routingName = explode(':', $route)[1];
        }


        if(!$file)
        {
            // Если AJAX подключаем content.html.twig иначе template.html.twig
            $file = 'template.html.twig';

            if($request->getCurrentRequest()->headers->get('X-Requested-With') === 'XMLHttpRequest')
            {
                $file = 'content.html.twig';
            }
        }

        $fileName = str_replace('.', '/', $routingName).'/'.$file;


        $content = null;

        /**
         * Подключаем шаблон в директории Template
         */
        $ModuleTemplate = '@Template';
        $view = $ModuleTemplate.'/'.$module.'/'.$fileName;

        if(file_exists($this->project_dir.'/templates/'.$module.'/'.$fileName))
        {
            $content = $this->environment->render($view, $parameters);
        }


        /**
         * Подключаем шаблон в директории @App
         */
        if($content === null)
        {
            $ModuleTemplate = '@App';
            $view = $ModuleTemplate.'/'.$module.'/Resources/view/'.$fileName;

            if(file_exists($this->project_dir.'/src/'.$module.'/Resources/view/'.$fileName))
            {
                $content = $this->environment->render($view, $parameters);
            }

        }

        /**
         * Подключаем шаблон в директории модуля
         */
        if($content === null)
        {
            $view = $moduleTemplateName.'/'.$fileName;
            $content = $this->environment->render($view, $parameters);
        }

        if($response === null)
        {
            $response = new Response();
        }

        $content = $this->contentMinify($content);

        $content = $this->cacheCss->getStyle(
            $fileName,
            $content,
            $module,
            $route,
            $this->requestStack->getCurrentRequest()->headers->get('x-device'),
            (bool) $this->getUsr()
        );

        $response->setContent($content);

        return $response;
    }


    protected function getUsr(): UserInterface|User|null
    {
        try
        {
            $token = $this->tokenStorage->getToken();
        }
        catch(UnauthorizedHttpException $exception)
        {
            $token = null;
        }

        return $token?->getUser();
    }


    protected function getCurrentUsr(): UserUid
    {
        $token = $this->tokenStorage->getToken();

        /** @var User $usr */
        $usr = $token?->getUser();

        if($usr && $token instanceof SwitchUserToken)
        {
            /** @var User $originalUser */
            $originalUser = $token->getOriginalToken()->getUser();

            if($originalUser?->getUserIdentifier() !== $usr?->getUserIdentifier())
            {
                return $originalUser->getId();
            }
        }

        return $usr->getId();
    }

    /** Возвращает идентификатор профиля */
    protected function getProfileUid(): ?UserProfileUid
    {
        return $this->getUsr()?->getProfile();
    }


    /** Возвращает идентификатор профиля, независимо от авторизации */
    protected function getCurrentProfileUid(): ?UserProfileUid
    {
        $token = $this->tokenStorage->getToken();

        $usr = $token?->getUser();

        if($usr && $token instanceof SwitchUserToken)
        {
            $originalUser = $token->getOriginalToken()->getUser();

            if($originalUser?->getUserIdentifier() !== $usr?->getUserIdentifier())
            {
                $usr = $originalUser;
            }
        }

        return $usr?->getProfile();
    }


    /** Возвращает идентификатор профиля либо NULL если администратор ресурса */
    protected function getAdminFilterProfile(): ?UserProfileUid
    {
        return $this->authorizationChecker->isGranted('ROLE_ADMIN') ? null : $this->getProfileUid();
    }


    /**
     * Создает и возвращает экземпляр формы.
     */
    protected function createForm(string $type, mixed $data = null, array $options = []): FormInterface
    {
        return $this->formFactory->create($type, $data, $options);
    }


    /**
     * Редирект на указанный Route Name
     */
    protected function redirectToRoute(string $route, array $parameters = [], int $status = 302): ?Response
    {
        $url = $this->router->generate($route, $parameters);

        $this->requestStack->getSession()
            ->set('statusCode', $status);

        /** Если запрос был AJAX - возвращаем на предыдущую страницу */
        if($jsonResponse = $this->responseXmlHttpRequest($url, $status))
        {
            return $jsonResponse;
        }

        return new RedirectResponse($url, $status);
    }


    /**
     * Редирект на указаннй нейм роута.
     */
    protected function redirectToReferer(int $status = 302): ?Response
    {
        $url = $this->requestStack->getCurrentRequest()->headers->get('referer');

        $this->requestStack->getSession()
            ->set('statusCode', $status);

        if($jsonResponse = $this->responseXmlHttpRequest($url, $status))
        {
            return $jsonResponse;
        }

        return new RedirectResponse($url, $status);
    }


    /**
     * Генерирует URL с параметрами параметров.
     *
     * @see UrlGeneratorInterface
     */
    protected function generateUrl(
        string $route,
        array $parameters = [],
        int $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH,
    ): string
    {
        return $this->router->generate($route, $parameters, $referenceType);
    }


    private function responseXmlHttpRequest(?string $url, int $status): ?Response
    {
        if(
            $this->requestStack
                ->getMainRequest()
                ?->isXmlHttpRequest()
        )
        {

            $referer = $this->requestStack->getCurrentRequest()->headers->get('referer');

            $flash = null;

            if($status !== 302)
            {
                $session = $this->requestStack->getSession();
                $session->clear();
                $flash = $session->getFlashBag()->all();
            }

            if(!$flash)
            {
                $flash = ['success' => ['success']];
            }


            $message = current($flash);

            return new JsonResponse(
                [
                    'status' => $status,
                    'header' => current(array_keys($flash)),
                    'message' => $message ? current($message) : '',
                    'redirect' => $url ?: $referer,
                ], status: $status
            );
        }

        return null;
    }
}
