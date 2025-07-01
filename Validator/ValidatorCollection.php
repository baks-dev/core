<?php
/*
 *  Copyright 2025.  Baks.dev <admin@baks.dev>
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

declare(strict_types=1);

namespace BaksDev\Core\Validator;

use ArrayObject;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class ValidatorCollection extends ArrayObject implements ValidatorCollectionInterface
{
    private string $uniqid;

    private bool $validate = false;

    private ArrayObject $errors;

    public function __construct(
        #[Target('validatorLogger')] private readonly LoggerInterface $logger,
        private readonly ValidatorInterface $validator,

    ) {
        parent::__construct();

        $this->uniqid = uniqid('', false);
        $this->errors = new ArrayObject();
    }

    public function init(): self
    {
        $this->uniqid = uniqid('', false);
        $this->errors = new ArrayObject();

        $this->exchangeArray([]);

        return $this;
    }

    public function add(?object $item, ?string $message = null, ?array $context = []): bool|string
    {
        $this->validate = true;

        if($item)
        {
            $this->offsetSet($item::class, $item);
            //$this->append($item);
            return true;
        }

        $this->error(
            $message ?: 'Not found object',
            $context ?: $item
        );

        return $this->validate = false;
    }

    public function isInvalid(): bool|string
    {

        /** Если при добавлении возникла ошибка  */
        if($this->validate === false)
        {
            return $this->uniqid;
        }


        foreach($this->getIterator() as $item)
        {
            try
            {
                $errors = $this->validator->validate($item);
            }
            catch(Exception $exception)
            {
                $this->logger->error($exception->getMessage());
                continue;
            }

            if(count($errors) > 0)
            {
                foreach($errors as $error)
                {
                    $this->error((string) $error);
                }

                return $this->uniqid;
            }
        }

        return false;
    }

    public function error($message, ?array $context = []): void
    {
        $this->errors->offsetSet($this->uniqid, (string) $message);
        $this->logger->error($this->uniqid.': '.$message, $context ?: []);
    }

    /**
     * Возвращает идентификатор ошибки
     */
    public function getErrorUniqid(): string
    {
        return $this->uniqid;
    }

    /**
     * Errors
     */
    public function getErrors(): ArrayObject
    {
        return $this->errors;
    }

}
