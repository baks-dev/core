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

namespace BaksDev\Core\Type\UserAgent\Type;

use BaksDev\Core\Type\UserAgent\UserAgentGenerator;
use BaksDev\Users\User\Type\Id\UserUid;
use InvalidArgumentException;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 * @group core-useragent
 */
#[When(env: 'test')]
final class UserAgentTest extends KernelTestCase
{

    public function testFalseEquals(): void
    {
        $userAgent = new UserAgentGenerator();
        $desktop = $userAgent->genDesktop();
        self::assertNotNull($desktop);

        //dd( $desktop );

//        $browscap = ini_get('browscap') ? get_browser($desktop) : null;
//        dump($desktop);
//        dd($browscap);

        //dd();

    }
}
