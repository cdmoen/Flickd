### DATABASE NODES FOR FRIEND LOGIC

# users/

{uid}/
email: string
username: string
avatarUrl: string | null
createdAt: number
settings:
...future private settings...

# usersPublic/

{uid}/
username: string
avatarUrl: string | null

# usersByUsername/

{username}: uid

# friends/

{uid}/
{friendUid}: true

# friendRequestsIncoming/

{uid}/
{fromUid}: true

# friendRequestsOutgoing/

{uid}/
{toUid}: true

# blocks/

{uid}/
{blockedUid}: true

# notifications/

{uid}/
{notificationId}/
type: string
from: uid | null
createdAt: number
read: boolean

# activity/

{uid}/
{activityId}/
type: string
data: object
createdAt: number

### WHAT EACH NODE IS FOR

# users/

Private profile data.
Only the owner can read/write.
Holds email, settings, and anything sensitive.

# usersPublic/

Public profile data.
Readable by all authenticated users.
Used for search results, friend lists, and profile previews.

# usersByUsername/

A global index for username → uid lookup.
Makes username search fast and scalable.

# friends/

Mutual friendships.
Each friendship is stored twice for O(1) lookups.

# friendRequestsIncoming/

Requests sent to you.
Used for navbar badges and accept/reject UI.

# friendRequestsOutgoing/

Requests you sent to others.
Used for “Request Sent” status and canceling requests.

# blocks/

Future‑proofing for blocking.
Prevents friend requests, hides users from search, etc.

# notifications/

Supports real‑time alerts:

- “X sent you a friend request”
- “X accepted your request”
- “X unfriended you”

# activity/

Optional but powerful.
Supports future social features like:

- “Colin and Sarah are now friends”
- “Colin updated his profile picture

# USER

/users/{userId} {
"username": "...",
"email": "...",
"createdAt": 123456789
}

Indexes
"users": {
".indexOn": ["email", "username"]
}

# User Watch Lists

/userLists/{userId}/{listId} {
"name": "Watch Later",
"createdAt": 123456789
}

/listItems/{listId}/{filmId} {
"addedBy": "{userId}",
"addedAt": 123456789
}

FRIENDS

/userFriends/{userId}/{friendId}: true

# GROUP METADATA

/groups/{groupId} {
"name": "Horror Marathon",
"createdAt": 123456789,
"createdBy": "{userId}"
}

# GROUP Members

/groupMembers/{groupId}/{userId}: true

# REVERSE LOOKUP COLLABORATOR

(groups a user collaborates on)
/userGroups/{userId}/{groupId}: true

# GROUP ITEMS

/groupItems/{groupId}/{filmId} {
"addedBy": "{userId}",
"addedAt": 123456789,
"notes": "We should watch this first"
}

# FILM DATA

/films/{filmId} {
"title": "...",
"year": 2023,
"posterUrl": "...",
"tmdbId": 12345
}
