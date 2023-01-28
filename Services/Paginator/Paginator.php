<?php
/*
 * Copyright (c) 2022.  Baks.dev <admin@baks.dev>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace BaksDev\Core\Services\Paginator;

use Doctrine\DBAL\Cache\QueryCacheProfile;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Query\QueryBuilder;
use Doctrine\DBAL\Statement;
use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

final class Paginator implements PaginatorInterface
{
	private const LIMIT = 100;
	
	public const LIMIT_ARRAY = [1, 10, 50, 100, 200, 500];
	
	private ?Request $request;
	private Connection $connection;
	
	private int $page;
	private int $next;
	private ?int $previous = null;
	private bool $pagination;
	private int $limit;
	private mixed $id;
	private array $data;
	
	
	/** Cache  */
	private CacheInterface $cacheFilesystem;
	
	private CacheInterface $cacheAcpu;
	
	
	const LIFETIME = 60 * 60 * 30; // 30 ней
	
	private QueryBuilder $stmt;
	
	
	private string $path;
	private string|false $namespace;
	
	private string $cacheKey;
	
	
	public function __construct(RequestStack $request, Connection $connection)
	{
		
		$this->request = $request->getCurrentRequest();
		$this->connection = $connection;
		
		$this->limit = max(0, $this->request->query->getInt('limit', self::LIMIT));
		$this->id = $this->request->attributes->get('id') ?: $this->request->get('id');
		$this->path = $this->request->get('_route');
		
		
		$this->page = $this->request->attributes->get('page') ?: $this->request->get('page');
		$this->next = $this->page + 1;
		$previous = $this->page - 1;
		$this->previous = $previous < 0 ? null : $previous;
		
		$namespace = explode(':', $this->path);
		$this->namespace = current($namespace);

		$this->cacheFilesystem = new FilesystemAdapter('Cache'.$this->namespace);
		$this->cacheAcpu = new ApcuAdapter($this->namespace);

	}
	
	/** Шастройки кеширования запроса */
	private function setTtlCache(QueryBuilder $qb) : void
	{
		
		$namespace = explode(':', $this->path);
		$this->namespace = current($namespace);
	
		/* Указываем адаптер кеша для подключения */
		$config = $this->connection->getConfiguration();
		$config->setResultCache($this->cacheFilesystem);
		
		/* Генерируем ключ кеша */
		$this->cacheKey = current(
			(new QueryCacheProfile())->generateCacheKeys($qb->getSQL(), $qb->getParameters(), $qb->getParameterTypes())
		);
		
		/* TTL кеша запроса для сброса */
		$ttl = $this->cacheAcpu->get($this->cacheKey.'_date', function(ItemInterface $item) {
			$resetLifetime = 5; // секунд
			$item->expiresAfter($resetLifetime);
			return time() + $resetLifetime;
		});
		
		if($this->request->getSession()->get('statusCode') === 302)
		{
			$this->cacheFilesystem->clear();
			$this->request->getSession()->remove('statusCode');
		}
		
		/* Если срок кеша истекает - делаем сброс */
		if($ttl < time())
		{
			register_shutdown_function([$this, 'resetCache'], 'throw');
			register_shutdown_function([$this, 'executeCacheQuery'], 'throw');
		}
	}
	
	
	public function fetchAllAssociative(QueryBuilder $qb) : self
	{
		
		$qb->setMaxResults($this->limit);
		$qb->setFirstResult($this->page * $this->limit);
		
		$this->setTtlCache($qb);
		
		$this->data = $this->executeCacheQuery($qb)->fetchAllAssociative();
		$this->pagination = count($this->data) >= $this->limit;
		
		return $this;
	}
	
	
	public function fetchAllAssociativeIndexed(QueryBuilder $qb) : self
	{
		
		$qb->setMaxResults($this->limit);
		$qb->setFirstResult($this->page * $this->limit);
		
		$this->setTtlCache($qb);
		
		$this->data = $this->executeCacheQuery($qb)->fetchAllAssociativeIndexed();
		$this->pagination = count($this->data) >= $this->limit;
		
		return $this;
	}
	
	/** Возвращает кешированный результат запроса  */
	private function executeCacheQuery(QueryBuilder $qb)
	{
		$this->profile = new QueryCacheProfile(self::LIFETIME, $this->cacheKey);
		
		return $this->connection->executeCacheQuery(
			$qb->getSQL(),
			$qb->getParameters(),
			$qb->getParameterTypes(),
			$this->profile
		);
	}
	
	/** Сбрасываем кеш результата запроса  */
	public function resetCache()
	{
		$cache = $this->cacheFilesystem;
		$cache->delete($this->cacheKey);
	}
	
	
	/** Возвращает массив данных, полученных в результате запроса в БД */
	public function getData() : array
	{
		return $this->data;
	}
	
	/** Возвращает переданное значение лимита */
	public function getLimit() : int
	{
		return $this->limit;
	}
	
	/** Возвращает дефолное значение LIMIT */
	public function getDefaultLimit() : int
	{
		return self::LIMIT;
	}
	
	/** Возвращает номер текущей страницы  */
	public function getPage() : int
	{
		return $this->page + 1;
	}
	
	/** Возвращает номер следующей страницы относительно текущей  */
	public function getNext() : int
	{
		return $this->next;
	}
	
	/** Возвращает номер предыдущей страницы относительно текущей  */
	public function getPrevious() : ?int
	{
		return $this->previous;
	}
	

	public function getPagination() : bool
	{
		return $this->pagination;
	}
	

	public function getPath() : string
	{
		return $this->path;
	}
	
	/** Возвращает массив доступных лимитов (для селекта) */
	public function getOptions() : array
	{
		return self::LIMIT_ARRAY;
	}
	
	/** Возвращает идентификатор, пеереданный атрибутом или параметром GET */
	public function getId() : mixed
	{
		return $this->id;
	}
}