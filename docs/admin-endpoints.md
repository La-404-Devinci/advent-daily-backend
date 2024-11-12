# Admin endpoints

Base url is `https://api-cova-dev.404devinci.fr/admin`

## Clubs

### GET /clubs

No additional data.

### POST /clubs

Body:

```json
{
    "name": "string",
    "avatarUrl": "string",
    "description": "string (optional)",
    "dailyDate": "string (optional)",
    "location": "string (optional)"
}
```

Note: If `dailyDate` is not provided, the club will be created with a daily date of today.

### PUT /clubs/:id

Params:

- `id`: number

Body:

```json
{
    "name": "string (optional)",
    "avatarUrl": "string (optional)",
    "description": "string (optional)",
    "dailyDate": "string (optional)",
    "location": "string (optional)"
}
```

### DELETE /clubs/:id

Params:

- `id`: number

## Challenges

### GET /challenges

No additional data.

### POST /challenges

Body:

```json
{
    "clubId": "number",
    "score": "number",
    "name": "string"
}
```

### PUT /challenges/:id

Params:

- `id`: number

Body:

```json
{
    "score": "number",
    "name": "string"
}
```

### DELETE /challenges/:id

Params:

- `id`: number

## Granters

### GET /granters

Query:

- `clubId`: number (optional)

Note: List all granters when no `clubId` is provided, otherwise list granters for the specified `clubId`.

### POST /granters

Body:

```json
{
    "clubId": "number",
    "email": "string"
}
```

### DELETE /granters/:id

## Users

### GET /users

No additional data.

### PUT /users/:id

Params:

- `id`: number

Body:

```json
{
    "clubId": "number (optional)",
    "email": "string (optional)",
    "password": "string (optional)",
    "username": "string (optional)",
    "avatarUrl": "string (optional)",
    "quote": "string (optional)"
}
```

### DELETE /users/:id

Params:

- `id`: number

## Dump

### GET /dump

No additional data.

### POST /dump

Body:

```json
{
  "type": "acquired" | "challenges" | "clubs" | "granters" | "users",
  "data": "string"
}
```

## Notification

### POST /notification

Body:

```json
{
    "title": "string",
    "message": "string",
    "iconUrl": "string (optional)"
}
```
