<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Command\Update;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;

#[AsCommand(
    name: 'baks:project:upgrade:all',
    description: 'Установка всех обновлений',
)]
class ProjectUpdateCommand extends Command
{
    private iterable $upgrades;

    public function __construct(
        #[TaggedIterator('baks.project.upgrade', defaultPriorityMethod: 'priority')] iterable $upgrades
    )
    {
        parent::__construct();

        $this->upgrades = $upgrades;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        foreach($this->upgrades as $upgrade)
        {
            $command = $this->getApplication()?->find($upgrade->getName());

            if($command)
            {
                $arguments = ['command' => $upgrade->getName()];

                $greetInput = new ArrayInput($arguments);
                $command->run($greetInput, $output);
            }
        }


        return $this::SUCCESS;
    }
}
