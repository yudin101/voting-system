# Voting System Backend

## Run Locally

**Clone the project**

```bash
git clone https://github.com/yudin101/voting-system.git
```

**Go to the project directory**

```bash
cd voting-system
```

**Install dependencies**

```bash
npm install
```

**Setup environment vairables**

```bash
echo "SERVER_PORT = server_port" > .env
echo "SESSION_SECRET = 'session_secret'" >> .env
echo "DB_USER = 'db_username'" >> .env
echo "DB_PASSWORD = 'db_password'" >> .env
echo "DB_HOST = 'db_host'" >> .env // example localhost
echo "DB_NAME = 'db_name'" >> .env
echo "DB_PORT = db_port" >> .env
```

**Start the development server**

```bash
npm run dev
```

## API Endpoints

### Admin Endpoints

#### `POST /api/admin/register`

_Login Required_

**Example Request:**

```json
{
  "id": 2,
  "username": "tester",
  "email": "tester@test.com",
  "password": "tester123"
}
```

#### `POST /api/admin/login`

**Example Request:**

```json
{
  "username": "tester",
  "password": "tester@test.com"
}
```

#### `GET /api/admin/logout`

_Login Required_

#### `DELETE /api/admin/delete`

_Login Required_

#### `GET /api/admin/info`

_Login Required_

**Possible Queries**

- id
- username
- email

**Example Endpoints:**

```
/api/admin/info?id="2"
/api/admin/info?username="tester"
/api/admin/info?email="tester@test.com"
```

### Voter Endpoints

#### `POST /api/voter/add`

_Login Required_

**Example Request:**

```json
{
  "id": 2,
  "first_name": "Stephen",
  "middle_name": "IDK", // optional
  "last_name": "Strange",
  "username": "drstrange",
  "email": "drstrange@test.com"
}
```

#### `GET /api/voter/check`

_Login Required_

**Possible Queries**

- id
- username
- email

**Example Endpoints**

```
/api/voter/check?id="2"
/api/voter/check?username="drstrange"
/api/voter/check?email="drstrange@test.com"
```

#### `PATCH /api/voter/update/:username`

_Login Required_

**Example endpoint and request:**

```
/api/voter/update/drstrange
```

```json
{
  "first_name": "Dr. Stephen",
    ...
}
```

#### `DELETE /api/voter/delete/:id`

_Login Required_

**Example Endpoint:**

```
/api/voter/delete/2
```

### Candidate Endpoints

#### `POST /api/candidate/add`

_Login Required_

**Example Request:**

```json
{
  "id": 2,
  "username": "fury",
  "first_name": "Nicholas",
  "middle_name": "J", // optional
  "last_name": "Fury",
  "description": "The one-eyed dude"
}
```

#### `GET /api/candidate/check`

**Possible Queries**

- id
- username

**Example endpoints:**

```
/api/candidate/check?id="2"
/api/candidate/check?username="fury"
```

#### `PATCH /api/candidate/update/:username`

_Login Required_

**Example endpoint and request:**

```
/api/candidate/update/fury
```

```json
{
  "first_name": "Nick",
    ...
}
```

#### `DELETE /api/candidate/delete/:username`

_Login Required_

**Example Endpoint:**

```
/api/candidate/delete/fury
```

### Voting Endpoints

#### `POST /api/vote`

```json
{
  "voter_id": 2,
  "candidate_id": 3
}
```

## Contributing

Contributions are always welcome!

If you'd like to contribute to this project, you can:

- **Create an Issue**: Report bugs or suggest features by [creating an issue](https://github.com/yudin101/voting-system/issues/new).
- **Open a Pull Request**: Submit code changes or improvements by [opening a pull request](https://github.com/yudin101/voting-system/pulls).

## License

This project is licensed under the [MIT License](https://github.com/yudin101/voting-system/blob/main/LICENSE).
