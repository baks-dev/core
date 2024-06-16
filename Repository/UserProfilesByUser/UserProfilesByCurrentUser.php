<?php

declare(strict_types=1);

namespace BaksDev\Core\Repository\UserProfilesByUser;

final class UserProfilesByCurrentUser implements UserProfilesByCurrentUserInterface
{
    /** Список профилей пользователя для смены */
    public function fetchAllUserProfilesAssociative(): array
    {
        return [];
    }

}