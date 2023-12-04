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

declare(strict_types=1);

namespace BaksDev\Core\Command;

use BaksDev\Core\Cache\AppCacheInterface;
use DirectoryIterator;
use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Process\Process;

// the name of the command is what users type after "php bin/console"
#[AsCommand(name: 'baks:git:commit')]
class GitCommitCommand extends Command
{
    private string $project_dir;


    public function __construct(
        #[Autowire('%kernel.project_dir%')] string $project_dir,
    )
    {
        parent::__construct();
        $this->project_dir = $project_dir;
    }


    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $path = $this->project_dir.'/vendor/baks-dev';

        /** @var DirectoryIterator $module */
        foreach(new DirectoryIterator($path) as $module)
        {
            if($module->isDot())
            {
                continue;
            }

            if($module->isDir())
            {

                //dump($module->getRealPath());


                //$process = Process::fromShellCommandline('git -C "'.$module->getRealPath().'" status');
                $process = Process::fromShellCommandline('git -C "/mnt/DATA/SYMFONY/bundles.baks.dev/vendor/baks-dev/auth-telegram" status');


                //$process = new Process(['git --git-dir='.$module->getRealPath().' status']);
                $process->run();

                $result = $process->getIterator($process::ITER_SKIP_ERR | $process::ITER_KEEP_OUTPUT)->current();



                dump($result);
                dd($module->getRealPath());

                foreach($process->getIterator() as $item)
                {
                    dump($item);
                }

                dd(545465);

//                $result = $process->getIterator($process::ITER_SKIP_ERR | $process::ITER_KEEP_OUTPUT)->current();
//
//                dump($result);

//                $appCache = $this->appCache->init($module->getFilename());
//                $appCache->clear();
//
//                $apcuCache = new ApcuAdapter($module->getFilename());
//                $apcuCache->clear();
//
//                $fileCache = new FilesystemAdapter($module->getFilename());
//                $fileCache->clear();

            }
        }

        return Command::SUCCESS;
    }
}