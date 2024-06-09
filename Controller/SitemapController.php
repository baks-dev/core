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

namespace BaksDev\Core\Controller;

use BaksDev\Products\Category\BaksDevProductsCategoryBundle;
use BaksDev\Reference\Cars\BaksDevReferenceCarsBundle;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;

#[AsController]
final class SitemapController extends AbstractController
{
    #[Route('/sitemap.xml', name: 'sitemap', methods: ['GET'])]
    #[Route('/sitemaps.xml', name: 'sitemaps', methods: ['GET'])]
    public function sitemap(): Response
    {
        $sitemaps = [];

        if(class_exists(BaksDevProductsCategoryBundle::class))
        {
            $sitemaps[] = [
                'loc' => 'products-category:sitemap'
            ];
        }

        if(class_exists(BaksDevReferenceCarsBundle::class))
        {
            $sitemaps[] = [
                'loc' => 'reference-cars:sitemap'
            ];
        }

        $response = $this->render(['sitemaps' => $sitemaps], routingName: 'sitemap');
        $response->headers->set('Content-Type', 'text/xml');

        return $response;
    }

    #[Route('/sitemap/urls.xml', name: 'sitemap.urls', methods: ['GET'])]
    public function homepage(): Response
    {
        $response = $this->render();
        $response->headers->set('Content-Type', 'text/xml');

        return $response;
    }
}
