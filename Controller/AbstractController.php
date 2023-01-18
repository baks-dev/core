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

use App\Module\Settings\Repository\SettingsMain\SettingsMainInterface;
use App\Module\Users\Profile\UserProfile\Repository\MenuUserProfileByUser\MenuUserProfileByUserInterface;
use App\Module\Users\Profile\UserProfile\Type\Id\UserProfileUid;
use App\Module\Users\User\Entity\User;

use BaksDev\Core\Type\Locale\Locale;
use Fresh\CentrifugoBundle\Service\Credentials\CredentialsGenerator;
use LogicException;
use Psr\Cache\InvalidArgumentException;
use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\Exception\SessionNotFoundException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment;

abstract class AbstractController
{
	private RouterInterface $router;
	private AuthorizationCheckerInterface $authorizationChecker;
	private Environment $environment;
	private RequestStack $requestStack;
	private CacheInterface $cache;
	//private ContainerBagInterface $containerBag;
	private TokenStorageInterface $tokenStorage;
	private FormFactoryInterface $formFactory;
	private TranslatorInterface $translator;
	private SettingsMainInterface $getSettingsMain;
	private MenuUserProfileByUserInterface $menuUserProfiles;
	private KernelInterface $appKernel;
	private CredentialsGenerator $credentialsGenerator;
	
	private string $device = 'pc';
	private string $user = 'guest';
	
	public function __construct(
		RouterInterface $router,
		AuthorizationCheckerInterface $authorizationChecker,
		Environment $environment,
		RequestStack $requestStack,
		CacheInterface $cache,
		//ContainerBagInterface $containerBag,
		FormFactoryInterface $formFactory,
		TranslatorInterface $translator,
		TokenStorageInterface $tokenStorage,
		SettingsMainInterface $getSettingsMain,
		MenuUserProfileByUserInterface $menuUserProfiles,
		KernelInterface $appKernel,
		CredentialsGenerator $credentialsGenerator
	
	)
	{
		$this->router = $router;
		$this->authorizationChecker = $authorizationChecker;
		$this->environment = $environment;
		$this->requestStack = $requestStack;
		$this->cache = $cache;
		//$this->containerBag = $containerBag;
		$this->tokenStorage = $tokenStorage;
		$this->formFactory = $formFactory;
		$this->translator = $translator;
		$this->getSettingsMain = $getSettingsMain;
		$this->menuUserProfiles = $menuUserProfiles;
		$this->appKernel = $appKernel;
		$this->credentialsGenerator = $credentialsGenerator;
		
	}
	
	
	/**
	 * Проверяем, имеется ли у пользователя соответствующая роль */
	protected function isGranted(mixed $attribute, mixed $subject = null) : bool
	{
		return $this->authorizationChecker->isGranted($attribute, $subject);
	}
	
	
	//    /**
	//     * Returns a rendered view.
	//     */
	//    protected function renderView(string $view, array $parameters = []): string
	//    {
	//        if(!$this->container->has('twig'))
	//        {
	//            throw new \LogicException(
	//              'You cannot use the "renderView" method if the Twig Bundle is not available. Try running "composer require symfony/twig-bundle".'
	//            );
	//        }
	//
	//        return $this->container->get('twig')->render($view, $parameters);
	//    }
	
	/**
	 * Renders a view.
	 */
	
	private $content;
	private $route;
	
	
	protected function render(
		array $parameters = [],
		string $fileName = null,
		string $moduleTemplateName = null,
		string $template = null,
		Response $response = null
	) : Response
	{

		$this->user = $this->tokenStorage->getToken() ? 'user' : 'guest';
		
		$request = $this->requestStack;
		
		$route = $request->getCurrentRequest()->attributes->get('_route');
		
		/* Определяем браузер пользователя */
		$userAgent = $request->getCurrentRequest()->headers->get('User-Agent');
		$device = get_browser($userAgent);
		
		/* Добавляем настройки в параметры */
		$parameters['settings'] = $this->settings();
		
		$parameters['user_profiles'] = $this->menuUserProfiles->get();
		
		$parameters['jwt_token'] = $this->jwt();
		
		/* Если не задан модуль - присваиваем из префикса роутинга */
		if(!$moduleTemplateName)
		{
			$moduleName = (explode(':', $route))[0];
			$moduleTemplateName = '@'.$moduleName;
			
		}
		
//		/* Если не задан наблон - присваиваем из настроек */
//		if(!$template)
//		{
//			$template = $parameters['settings']['template'];
//		}
		
		
		$routingName = (explode(':', $route))[1];
		
		/* Если не задан файл - присваиваем из имени роутинга */
		if(!$fileName)
		{
			/* Если AJAX подключаем content.html.twig иначе template.html.twig */
			$file = 'template.html.twig';
			
			if('XMLHttpRequest' === $request->getCurrentRequest()->headers->get('X-Requested-With'))
			{
				$file = 'content.html.twig';
			}
			
			$fileName = str_replace('.', '/', $routingName).'/'.$file;
			
		} else
		{
			$fileName = str_replace('.', '/', $routingName).'/'.$fileName;
		}
		
		/* Подключаем катомный шаблон в папке @Template */
		try
		{
			$ModuleTemlate = "@Template";
			
			$view = $ModuleTemlate.'/'.$moduleName.'/'.$fileName;
	
			if($device->ismobiledevice)
			{
				/* Если девайс Планшет - подключаем кастомный шаблон @Template/tablet */
				if($device->istablet)
				{
					$view = str_replace($file, 'tablet/'.$file, $view);
					$this->device = 'tablet';
					
					
				}
				
				/* Если девайс Мобильный - подключаем кастомный шаблон @Template/mobile */
				else
				{
					$view = str_replace($file, 'mobile/'.$file, $view);
					$this->device = 'mobile';
				}
			}
			
			$parameters['settings']['device'] = $this->device;
			$content = $this->environment->render($view, $parameters);
		}
		
		/* Если при подключении кастомного шаблона возникло исключение - подключаем дефолтные шаблоны модуля */
		catch(\Exception $exception)
		{
			try
			{

				$view = $moduleTemplateName.'/'.$fileName;

				if($device->ismobiledevice)
				{
					if($device->istablet)
					{
						$view = str_replace($file, 'tablet/'.$file, $view);
						$this->device = 'tablet';
					} else
					{
						$view = str_replace($file, 'mobile/'.$file, $view);
						$this->device = 'mobile';
					}
				}

				$parameters['settings']['device'] = $this->device;
				$content = $this->environment->render($view, $parameters);
				
				//$content = $this->renderView($view, $parameters);
			}
			catch(\Exception $exception)
			{
				$this->device = 'pc';
				$parameters['settings']['device'] = $this->device;
				$view = $moduleTemplateName.'/'.$fileName;
			
				
				//$content = $this->renderView($view, $parameters);
				$content = $this->environment->render($view, $parameters);
			}
		}
		
		if(null === $response)
		{
			$response = new Response();
		}
		
		$this->content = $content;
		$this->route = $route;
		
		/* Не применяем стили к AJAX запросам */
		if('XMLHttpRequest' !== $request->getCurrentRequest()->headers->get('X-Requested-With'))
		{
			$content = $this->assets_css($content, $route);
		}
		
		$response->setContent($content);
		
		return $response;
	}
	
	
	
	public function resetCacheCss() : void
	{
		$cache = $this->cache;
		$cache->delete($this->user.$this->device.'-'.$this->route);
		$this->assets_css($this->content, $this->route);
	}
	
	public function assets_css($content, $route) : string
	{
		
		$cache = $this->cache;
		$cache_key = $this->user.$this->device.'-'.$this->route;
		
		$hash = $cache->hasItem($cache_key);
		if($hash)
		{
			register_shutdown_function([$this, 'resetCacheCss'], 'throw');
		}
		
		//dump($cache_key);
		
		/* Кешируем по названию роутинга - результат компиляции файлов */
		$styles = $cache->get($cache_key, function(ItemInterface $item) use ($content)
		{
			$item->expiresAfter(3600 * 24 * 31); // 3600 = 1 час
			
			// class&#x3D;&quot;
			// &quot;
			
			//  //"|class=(\"\&#x3D;\&quot;)(.*)(\"\&quot;)|si",
			
			/* Ищем все теги class="..." */
			\preg_match_all(
				
				"|class=\"(.*)\"|U",
				$content,
				$out,
				PREG_PATTERN_ORDER
			);
			
			$classes = null;
			
			foreach($out[1] as $class)
			{
				foreach(explode(' ', $class) as $css_class)
				{
					if(!empty($css_class))
					{
						$classes[$css_class] = '.'.$css_class;
					}
				}
			}
			
			if($classes === null)
			{
				return '';
			}
			
			
			\preg_match_all(
				
				"|class&#x3D;&quot;(.*)&quot;|U",
				$content,
				$out,
				PREG_PATTERN_ORDER
			);
			
			foreach($out[1] as $class)
			{
				
				$class = str_replace('&#x20;', ' ', $class);
				
				foreach(explode(' ', $class) as $css_class)
				{
					if(!empty($css_class))
					{
						$classes[$css_class] = '.'.$css_class;
					}
				}
			}
			
			$styles = '';
			
			$file = $this->appKernel->getProjectDir().'/src/System/Resources/assets/css/original.min.css';
			
			$css = file_get_contents($file);
			preg_match_all('/([a-z0-9\s\.\:#_\-@,%\[\]()\'"=*\\>~\/+]+)\{([^\}]*)\}/si', $css, $arr);
			$css = $arr[0];
			
			foreach($css as $style)
			{
				foreach($classes as $cls)
				{
					if(stripos($style, $cls) !== false)
					{
						$styles .= $style;
					}
				}
			}
			
			return $styles;
		});
		
		
		$content = str_replace('<style></style>', '<style>'.$styles.'</style>', $content);
		$content = $this->contentMinify($content);
		
		return $content;
	}
	
	public function contentMinify(string $body)
	{
		$replace = [
			//удалить вкладки до и после тегов HTML
			//'/\>[^\S ]+/s' => '>',
			//'/[^\S ]+\</s' => '<',
			
			//сократить несколько последовательностей пробелов; сохраняйте символы новой строки, потому что они имеют значение в JS!!!
			'/([\t ])+/s' => ' ',
			
			//удалить начальные и конечные пробелы
			'/^([\t ])+/m' => '',
			'/([\t ])+$/m' => '',
			
			// удалить комментарии строки JS (только простые); НЕ удаляйте строки, содержащие URL (e.g. 'src="http://server.com/"')!!!
			//'~//[a-zA-Z0-9 ]+$~m' => '',
			
			//удалить пустые строки (последовательность символов конца строки и пробелов)
			'/[\r\n]+([\t ]?[\r\n]+)+/s' => "\n",
			
			//удалить пустые строки (между тегами HTML); не может удалить любые символы конца строки, потому что во встроенном JS они могут иметь значение!
			'/\>[\r\n\t ]+\</s' => '><',
			
			//удалить «пустые» строки, содержащие только символ конца блока JS; присоединиться к следующей строке (например, "}\n}\n<script>" --> "}}<script>"
			//'/}[\r\n\t ]+/s' => '}',
			//'/}[\r\n\t ]+,[\r\n\t ]+/s' => '},',
			
			//удалить новую строку после запуска функции или условия JS; присоединиться к следующей строке
			//'/\)[\r\n\t ]?{[\r\n\t ]+/s' => '){',
			//'/,[\r\n\t ]?{[\r\n\t ]+/s' => ',{',
			
			//удалить новую строку после конца строки JS (только самые очевидные и безопасные случаи)
			//'/\),[\r\n\t ]+/s' => '),',
			
			//удалить кавычки из HTML-атрибутов, не содержащих пробелов; держите URL-адреса в кавычках!
			//'~([\r\n\t ])?([a-zA-Z0-9]+)="([a-zA-Z0-9_/\\-]+)"([\r\n\t ])?~s' => '$1$2=$3$4',
			
			//1 и 4 вставляют первый найденный символ пробела до и после атрибута
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
	
	
	
	
	public function settings() : ?array
	{
		
		//        dd(array_filter(
		//             get_declared_classes(),
		//             function ($className) {
		//                 return in_array(GetSettingsMainInterface::class, class_implements($className));
		//             }
		//           ));
		
		//dd(in_array('GetSettingsMainInterface', class_implements('className')));
		
		$request = $this->requestStack;
		
		$host = $request->getCurrentRequest()?->getHost();
		$lang = $request->getCurrentRequest()?->getLocale(); /* присваиваем локаль */
		
		$cache = new ApcuAdapter();
		
		$data = $cache->get($host.'cache.settings.'.$lang, function(ItemInterface $item){
			/* Время кешировния настроек 31536000 = 1 год */
			$item->expiresAfter(31536000);
			return $this->getSettingsMain->getQuery() ?: [];
		});
		
		
		if(empty($data))
		{
			$cache->delete($host.'cache.settings.'.$lang);
			
			$data['meta_title'] = 'Добро пожаловать';
			$data['description'] = 'Более 150 000 товаров по низким ценам';
			$data['keywords'] = 'интернет, магазин, купить';
			$data['tags'] = 'интернет, магазин, купить';
		}
		
		//$data['template'] = 'default'; /* шаблон по умолчанию */
		
		return $data;
	}
	
	
	protected function getUser() : UserInterface|User|null
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
	
	
	protected function getProfileUid() : ?UserProfileUid
	{
		
		$profiles = $this->getUser()?->getProfile();
		return isset($profiles['user_profile_id']) ? new UserProfileUid(
			$profiles['user_profile_id'],
			$profiles['username']
		) : null;
	}
	
	
	/**
	 * Создает и возвращает экземпляр формы
	 */
	protected function createForm(string $type, mixed $data = null, array $options = []) : FormInterface
	{
		return $this->formFactory->create($type, $data, $options);
	}
	
	
	/** Добавляет сообщение пользователю постпредством сессий */
	public function addFlash(
		string $type,
		mixed $message,
		string $domain = 'messages',
		array|string $arguments = null
	)
	{
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
						} else
						{
							$message = sprintf($message, $arguments);
						}
					}
					
				}
				
				$label = $this->translator->trans($type, [], $domain);
				$this->requestStack->getSession()->getFlashBag()->add($label, $message);
				
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
	}
	
	/**
	 * Редирект на указаннй нейм роута
	 */
	protected function redirectToRoute(string $route, array $parameters = [], int $status = 302) : ?Response
	{
		$url = $this->router->generate($route, $parameters, UrlGeneratorInterface::ABSOLUTE_PATH);
		$this->requestStack->getSession()->set('statusCode', $status);
		
		if($jsonResponse = $this->responseXmlHttpRequest($url, $status))
		{
			
			return $jsonResponse;
		}
		
		return new RedirectResponse($url, $status);
	}
	
	
	/**
	 * Редирект на указаннй нейм роута
	 */
	protected function redirectToReferer(int $status = 302) : ?Response
	{
		$url = $this->requestStack->getCurrentRequest()->headers->get('referer');
		$this->requestStack->getSession()->set('statusCode', $status);
		
		if($jsonResponse = $this->responseXmlHttpRequest($url, $status))
		{
			return $jsonResponse;
		}
		
		return new RedirectResponse($url, $status);
	}
	
	
	private function responseXmlHttpRequest(string $url, int $status) : ?Response
	{
		if($this->requestStack->getMainRequest()?->isXmlHttpRequest())
		{
			$flash = ['success' => ['success']];
			
			if($status !== 302)
			{
				$session = $this->requestStack->getSession();
				$session->clear();
				$flash = $session->getFlashBag()->all();
			}
			
			return new JsonResponse([
				'status' => $status,
				'header' => current(array_keys($flash)),
				'message' => current(current($flash)),
				'redirect' => $url,
			], $status);
		}
		
		return null;
	}
	
	
	/**
	 * Генерирует URL с параметрами параметров.
	 *
	 * @see UrlGeneratorInterface
	 */
	protected function generateUrl(
		string $route,
		array $parameters = [],
		int $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH
	) : string
	{
		return $this->router->generate($route, $parameters, $referenceType);
	}
	
	public function getLocale() : Locale
	{
		return new Locale($this->translator->getLocale());
	}
	
	
	/* также в конфиге зменить время ttl */
	public const JWT_CACHE_KEY = 'cache.jwt';
	public const JWT_CACHE_EXP = 86400;  # 1 день
	
	public function jwt() : ?string
	{
		$data = null;
		//$cacheNotice = $this->container->get('cache.adapter.array');
		
		$cacheNotice = new ApcuAdapter();
		
		$user = $this->getUser();
		$profile = $this->getProfileUid();
		
		if($user && $profile)
		{
			
			$data = $cacheNotice->get(
				self::JWT_CACHE_KEY.'.'.$profile->getValue(),
				function(ItemInterface $item) use ($profile){
					$item->expiresAfter(self::JWT_CACHE_EXP);
					return $this->credentialsGenerator->generateJwtTokenForUser($profile);
				}
			);
		}
		
		return $data;
	}
}



//class Shutdown
//{
//    public static function Method ()
//    {
//        sleep(15);
//        mkdir("/home/bundles.baks.dev/public/assets/".time(), 0700);
//    }
//}
//
//// 3. Throw an exception
//register_shutdown_function (array (Shutdown::class, 'Method'), 'throw');