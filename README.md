# Lambda Concurrency Test

This is a test if AWS Lambda with Node.js can handle more than one connection per Node.js process. We know that it can handle multiple requests by creating new Node.js process, but it was not clear to me (by reading the docs alone), if one Node.js process could handle more than one connection.

Node.js has only one main thread, but it can handle multiple connections simultaneously when there are async operations. While it's awaiting IO for one client (a fetch for example), it can handle a connection for a second client. But in AWS Lambda documentation, apparently this is apparently not possible.

Although this test is too simple for a definitive conclusion, it indicates that AWS Lambda spawns one process per concurrent requests. If there are five concurrent requests, it will spawn five Lambda Node.js process.

## Configuring and Deploying

1. Install Serverless globally:

```shell
npm install -g serverless
```

2. Configure a AWS user with programmatic access and get the access key and secret access key.

3. Configure Serverless credentials:

```shell
serverless config credentials --provider aws --key [access key] --secret [secret access key]
```

4. Deploy the code to AWS:

```shell
sls deploy
```

> To redeploy the function code only we can use `sls deploy function -f hello`.

## Running

To run we can use the `client.js` file. This will make 5 simultaneous requests to the AWS Lambda. The URL in this file must be updated to the one you deploy on your AWS account.

```shell
node client.js
```

## Results

First execution (5 concurrent requests) - the `globalData` did not got mixed between the calls. And in the AWS Lambda console we can see it allocated 5 lambdas, one for each request. This indicates that one Node.js process can handle only one request at time in AWS Lambda.

```text
$ node client.js
test: 5.655s
{
  "client": "Ana",
  "globalData": {
    "counter": 1,
    "client": "Ana",
    "clients": [
      "Ana"
    ]
  },
  "message": "ok"
}
{
  "client": "Mario",
  "globalData": {
    "counter": 1,
    "client": "Mario",
    "clients": [
      "Mario"
    ]
  },
  "message": "ok"
}
{
  "client": "Dean",
  "globalData": {
    "counter": 1,
    "client": "Dean",
    "clients": [
      "Dean"
    ]
  },
  "message": "ok"
}
{
  "client": "John",
  "globalData": {
    "counter": 1,
    "client": "John",
    "clients": [
      "John"
    ]
  },
  "message": "ok"
}
{
  "client": "Barbara",
  "globalData": {
    "counter": 1,
    "client": "Barbara",
    "clients": [
      "Barbara"
    ]
  },
  "message": "ok"
}
```

Second execution (5 concurrent requests) - this was executed immediately after the first one. The `globalData` still have the data from the previous execution. So the memory is not clear between subsequent executions. Global variable memory is only empty if it's a Lambda cold start.

```text
$ node client.js
test: 5.515s
{
  "client": "Ana",
  "globalData": {
    "counter": 2,
    "client": "Ana",
    "clients": [
      "Ana",
      "Ana"
    ]
  },
  "message": "ok"
}
{
  "client": "Barbara",
  "globalData": {
    "counter": 2,
    "client": "Barbara",
    "clients": [
      "John",
      "Barbara"
    ]
  },
  "message": "ok"
}
{
  "client": "Dean",
  "globalData": {
    "counter": 2,
    "client": "Dean",
    "clients": [
      "Mario",
      "Dean"
    ]
  },
  "message": "ok"
}
{
  "client": "John",
  "globalData": {
    "counter": 2,
    "client": "John",
    "clients": [
      "Barbara",
      "John"
    ]
  },
  "message": "ok"
}
{
  "client": "Mario",
  "globalData": {
    "counter": 2,
    "client": "Mario",
    "clients": [
      "Dean",
      "Mario"
    ]
  },
  "message": "ok"
}
```
