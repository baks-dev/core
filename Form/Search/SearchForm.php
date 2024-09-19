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

namespace BaksDev\Core\Form\Search;

use BaksDev\Products\Product\Forms\ProductFilter\Admin\ProductFilterDTO;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

final class SearchForm extends AbstractType
{
    private SessionInterface|false $session = false;

    private string $sessionKey;

    public function __construct(private readonly RequestStack $request)
    {
        $this->sessionKey = md5(self::class);
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        /* TextType */
        $builder->add('query', TextType::class, [
            'attr' => [
                'class' => 'w-100',
                'placeholder' => 'Search',
            ],
            'label' => false,
            'required' => false,
        ]);

        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event): void {

            /** @var SearchDTO $data */
            $data = $event->getData();
            $builder = $event->getForm();

            if($this->session === false)
            {
                $this->session = $this->request->getSession();
            }

            if($this->session && $this->session->get('statusCode') === 307)
            {
                $this->session->remove($this->sessionKey);
                $this->session = false;
            }

            if($this->session && (time() - $this->session->getMetadataBag()->getLastUsed()) > 300)
            {
                $this->session->remove($this->sessionKey);
                $this->session = false;
            }

            if($this->session)
            {
                $sessionData = $this->request->getSession()->get($this->sessionKey);
                $sessionJson = $sessionData ? base64_decode($sessionData) : false;
                $sessionArray = $sessionJson !== false && json_validate($sessionJson) ? json_decode($sessionJson, true, 512, JSON_THROW_ON_ERROR) : false;

                if($sessionArray !== false)
                {
                    isset($sessionArray['search']) ? $data->setQuery($sessionArray['search']) : false;
                }
            }


        });


        $builder->addEventListener(
            FormEvents::POST_SUBMIT,
            function (FormEvent $event): void {


                if($this->session === false)
                {
                    $this->session = $this->request->getSession();
                }


                if($this->session)
                {
                    /** @var SearchDTO $data */
                    $data = $event->getData();

                    $sessionArray = [];
                    $data->getQuery() ? $sessionArray['search'] = $data->getQuery() : false;

                    if($sessionArray)
                    {
                        $sessionJson = json_encode($sessionArray, JSON_THROW_ON_ERROR);
                        $sessionData = base64_encode($sessionJson);
                        $this->request->getSession()->set($this->sessionKey, $sessionData);
                        return;
                    }

                    $this->session->remove($this->sessionKey);
                }


            }
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults(
            [
                'translation_domain' => 'core.search',
                'data_class' => SearchDTO::class,
                'method' => 'POST',
                'attr' => ['class' => 'w-100'],
            ]
        );
    }
}
