<?php
/*
 *  Copyright 2026.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Command;

use BaksDev\Core\Messenger\MessageDispatchInterface;
use BaksDev\Manufacture\Part\Messenger\ManufacturePartMessage;
use BaksDev\Orders\Order\Messenger\OrderMessage;
use BaksDev\Orders\Order\Type\Event\OrderEventUid;
use BaksDev\Orders\Order\Type\Id\OrderUid;
use BaksDev\Products\Product\Messenger\ProductMessage;
use BaksDev\Products\Product\Type\Event\ProductEventUid;
use BaksDev\Products\Product\Type\Id\ProductUid;
use BaksDev\Products\Stocks\Messenger\Orders\EditProductStockTotal\EditProductStockTotalMessage;
use BaksDev\Products\Stocks\Messenger\ProductStockMessage;
use BaksDev\Products\Stocks\Type\Event\ProductStockEventUid;
use BaksDev\Products\Stocks\Type\Id\ProductStockUid;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'baks:development',
    description: 'Тестовая комманда разработчика'
)]
class DevelopmentCommand extends Command
{
    public function __construct(private readonly MessageDispatchInterface $MessageDispatch)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $message = new EditProductStockTotalMessage(
            id: new ProductStockUid('019c0193-0fac-7918-8aa5-8df2e94fddf8'),
            event: new ProductStockEventUid('019c0198-3a2a-7686-9c35-24932eecea65'),
            last: new ProductStockEventUid('019c0196-79c3-76d3-b7e5-dc26e6d20582'),
        );


        $message = new ManufacturePartMessage(
            '019e062b-3422-76ab-afa7-27fa993a6073',
            '019e063d-e9db-7fd5-bf11-3c6669a17911',
        );

        $message = new ProductMessage(
            id: new ProductUid('019dafee-031e-71c8-9db7-adaf6517cd0f'),
            event: new ProductEventUid('019e1d75-92da-74e3-9371-45abebf9314d'),
            last: new ProductEventUid('019db098-44a4-7140-80b4-d9c7757d39c3'),
        );

        $this->MessageDispatch->dispatch($message);

        $io->success('baks:development');
        return Command::SUCCESS;
    }
}
