<?php
/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Type\Modify;

use BaksDev\Core\Type\Modify\Modify\Collection\ModifyActionInterface;
use BaksDev\Core\Type\Modify\Modify\ModifyActionNew;
use BaksDev\Wildberries\Orders\Type\OrderStatus\Status\Collection\WbOrderStatusInterface;

/** Локализация  */
final class ModifyAction
{
    public const string TYPE = 'modify_action';

    public const string TEST = ModifyActionNew::class;

    private ModifyActionInterface $action;


    public function __construct(ModifyActionInterface|self|string $action)
    {

        if(is_string($action) && class_exists($action))
        {
            $instance = new $action();

            if($instance instanceof ModifyActionInterface)
            {
                $this->action = $instance;
                return;
            }
        }

        if($action instanceof ModifyActionInterface)
        {
            $this->action = $action;
            return;
        }

        if($action instanceof self)
        {
            $this->action = $action->getModifyAction();
            return;
        }

        /** @var ModifyActionInterface $declare */
        foreach(self::getDeclared() as $declare)
        {
            if($declare::equals($action))
            {
                $this->action = new $declare;
                return;
            }
        }

        $this->action = new ModifyActionNew();

        //throw new \InvalidArgumentException(sprintf('Not found ModifyAction %s', $action));

    }

    public function __toString(): string
    {
        return $this->action->getvalue();
    }


    public function getModifyAction(): ModifyActionInterface
    {
        return $this->action;
    }

    public function getModifyActionValue(): string
    {
        return $this->action->getValue();
    }

    public function equals(mixed $status): bool
    {
        $status = new self($status);

        return $this->getModifyActionValue() === $status->getModifyActionValue();
    }


    public static function cases(): array
    {
        $case = [];

        foreach(self::getDeclared() as $key => $action)
        {
            /** @var ModifyActionInterface $action */
            $class = new $action;
            $case[$class::sort().$key] = new self($class);
        }

        return $case;
    }


    public static function getDeclared(): array
    {
        return array_filter(
            get_declared_classes(),
            static function($className) {
                return in_array(ModifyActionInterface::class, class_implements($className), true);
            }
        );
    }

}