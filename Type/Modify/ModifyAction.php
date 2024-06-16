<?php

namespace BaksDev\Core\Type\Modify;

use BaksDev\Core\Type\Modify\Modify\Collection\ModifyActionInterface;
use BaksDev\Core\Type\Modify\Modify\ModifyActionNew;
use BaksDev\Wildberries\Orders\Type\OrderStatus\Status\Collection\WbOrderStatusInterface;

/** Локализация  */
final class ModifyAction
{
    public const TYPE = 'modify_action';

    public const TEST = ModifyActionNew::class;

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