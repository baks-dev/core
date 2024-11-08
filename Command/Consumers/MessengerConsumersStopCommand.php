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

declare(strict_types=1);

namespace BaksDev\Core\Command\Consumers;

use BaksDev\Core\Messenger\MessengerConsumers;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ChoiceQuestion;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'baks:consumers:stop',
    description: 'Завершает все запущенные воркеры Messenger'
)]
class MessengerConsumersStopCommand extends Command
{
    public function __construct(private readonly MessengerConsumers $MessengerConsumers)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->error('Все воркеры будут остановлены! Для запуска потребуется запустить их в ручную!');

        $helper = $this->getHelper('question');

        $questions[] = 'Нет';
        $questions[] = 'Да';

        $question = new ChoiceQuestion(
            'Остановить все запущенные воркеры?',
            $questions,
            0
        );

        $ask = $helper->ask($input, $output, $question);

        if($ask === 'Да')
        {
            $services = $this->MessengerConsumers->toArray();

            $starts = null;

            if(false === $services)
            {
                $io->comment('Ни одного запущенного воркера не найдено');
                return Command::SUCCESS;
            }

            $io->warning('Для последующего запуска воркеров используйте комманды:');

            foreach($services as $name)
            {
                $io->text(sprintf('systemctl start %s.service', $name));
            }

            $this->MessengerConsumers->stop();

            $io->success('Messenger Consumers успешно завершены');
        }

        return Command::SUCCESS;
    }
}