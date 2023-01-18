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

namespace App\System\Form\Search;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

final class SearchForm extends AbstractType
{
    
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        /* TextType */
        $builder->add('query', TextType::class, [
          'attr' => [
            'class' => 'w-100',
            /*'onfocus' => "this.value=''",*/
            'placeholder' => 'Search'
          ],
          'label' => false,
          'required' => false
        ]);
		
    }
    
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults
        (
          [
            'data_class' => SearchDTO::class,
            'method' => 'POST',
			'attr' => ['class' => 'd-flex align-items-center position-relative']
          ]);
    }
    
}
