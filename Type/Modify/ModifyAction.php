<?php

namespace BaksDev\Core\Type\Modify;


/** Локализация  */
final class ModifyAction
{
    public const TYPE = 'modify_action';
    
    private ModifyActionEnum $action;
    
    public function __construct(string|ModifyActionEnum $action)
    {
        if($action instanceof ModifyActionEnum)
        {
            $this->action = $action;
        }
        else
        {
            $this->action = ModifyActionEnum::from($action);
        }
        
        
    }
    
    public function __toString() : string
    {
        return $this->action->value;
    }
    
    /**
     * @return string
     */
    public function getValue() : string
    {
        return $this->action->value;
    }
    
    /**
     * @return string
     */
    public function getName() : string
    {
        return $this->action->name;
    }
    
    
    public function equals(ModifyActionEnum $action)
    {
        return $this->action === $action;
    }
    
    
    public static function cases() : array
    {
        return ModifyActionEnum::cases();
    }

}