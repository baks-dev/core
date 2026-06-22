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
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *
 */

namespace BaksDev\Core\Controller\Admin;

use BaksDev\Core\Controller\AbstractController;
use BaksDev\Core\Listeners\Event\Security\RoleSecurity;
use BaksDev\Ozon\Orders\Repository\OzonDashboard\OzonDashboardInterface;
use DateInterval;
use DateTimeImmutable;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
#[RoleSecurity('ROLE_ADMINISTRATION')]
class HomeController extends AbstractController
{
    #[Route('/admin', name: 'admin.homepage')]
    public function index(
        Request $request,
        ?OzonDashboardInterface $OzonDashboardRepository = null
    ): Response
    {

        $date = $request->request->get('date', date('Y-m-d'));

        try
        {
            $dayFinishDay = new DateTimeImmutable($date);
        }
        catch(Exception)
        {
            $dayFinishDay = new DateTimeImmutable('now');
        }

        $dateValid = new DateTimeImmutable('now')->sub(DateInterval::createFromDateString('1 day'));

        if($dayFinishDay > $dateValid)
        {
            $dayFinishDay = $dateValid;
        }

        $dayStartDay = $dayFinishDay;
        $dayStartMonth = $dayFinishDay->sub(DateInterval::createFromDateString('1 month'));
        $dayStartYear = $dayFinishDay->sub(DateInterval::createFromDateString('1 year'));

        /** Озон дневная статистика */
        $ozonDay = null;
        $ozonMonth = null;
        $ozonYear = null;

        if(
            $OzonDashboardRepository instanceof OzonDashboardInterface
            && $this->isGranted('ROLE_FINANCE')
        )
        {
            $ozonDay = $OzonDashboardRepository
                ->dayStart($dayStartDay)
                ->dayFinish($dayFinishDay)
                ->findAll();

            $ozonMonth = $OzonDashboardRepository
                ->dayStart($dayStartMonth)
                ->dayFinish($dayFinishDay)
                ->findAll();

            $ozonYear = $OzonDashboardRepository
                ->dayStart($dayStartYear)
                ->dayFinish($dayFinishDay)
                ->findAll();
        }

        return $this->render([

            'current_date' => $dayFinishDay->format('Y-m-d'),

            'day_start' => $dayFinishDay,
            'day_start_month' => $dayStartMonth,
            'day_start_year' => $dayStartYear,

            'ozon_day' => $ozonDay,
            'ozon_month' => $ozonMonth,
            'ozon_year' => $ozonYear,
        ]);
    }
}
