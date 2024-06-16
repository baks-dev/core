<?php

namespace BaksDev\Core\Repository\UserProfilesByUser;

interface UserProfilesByCurrentUserInterface
{
    public function fetchAllUserProfilesAssociative(): array;

}