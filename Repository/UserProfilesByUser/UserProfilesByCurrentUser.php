<?php

declare(strict_types=1);

namespace BaksDev\Core\Repository\UserProfilesByUser;

final class UserProfilesByCurrentUser implements UserProfilesByCurrentUserInterface
{
	public function fetchAllUserProfilesAssociative() : ?array
	{
		return [];
	}
}