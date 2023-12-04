<?php

namespace BaksDev\Core\Type\Field;

use BaksDev\Core\Services\Fields\FieldsChoiceInterface;
use BaksDev\Core\Services\Reference\ReferenceChoiceInterface;

/** Типы полей */
final class InputField
{
	public const TYPE = 'field_type';
	
	private ?string $field = null;
	
	public function __construct(null|string|FieldsChoiceInterface|ReferenceChoiceInterface $type)
	{
		if($type instanceof FieldsChoiceInterface || $type instanceof ReferenceChoiceInterface)
		{
			$this->field = $type->type();
		}
		else
		{
			$this->field = $type;
		}
	}
	
	public function __toString(): string
	{
		return $this->field ?:'';
	}
	
	
	public function getType() : ?string
	{
		return $this->field;
	}
	
}