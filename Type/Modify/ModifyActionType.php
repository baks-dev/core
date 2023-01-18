<?php

namespace App\System\Type\Modify;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;

final class ModifyActionType extends StringType
{
    public function convertToDatabaseValue($value, AbstractPlatform $platform) : mixed
    {
        return $value instanceof ModifyAction ? $value->getValue() : (new ModifyAction($value))->getValue();
    }
    
    public function convertToPHPValue($value, AbstractPlatform $platform) : mixed
    {
        return $value ? new ModifyAction($value) : null;
    }
    
    public function getName() : string
    {
        return ModifyAction::TYPE;
    }
    
    public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
    {
        return true;
    }
    
    public function getSQLDeclaration(array $column, AbstractPlatform $platform) : string
    {
        $column['length'] = 3;
        
        return $platform->getVarcharTypeDeclarationSQL($column);
    }
    
}