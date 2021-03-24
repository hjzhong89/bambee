# Bambee Coding Challenge

This project deploys a CRUD API to create, view, and update user tasks.

## Usage

1. Install application: `npm i`
2. [Get Programmatic Access to AWS Credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)
3. Update `serverless.yaml` with correct `custom.aws.region` and `custom.aws.accountId`
4. Deploy: `sls deploy --stage test`

A new CloudFormation stack will be created as `bambee-challenge-test`.

## Design Decisions

### Database

I chose DynamoDB for the database because of the simplicity of the use case, pre-defined access patterns, and 
support from the AWS-SDK. Since the User ID is used as the Hash key, pulling all tasks for a given user is efficient 
since DynamoDB can return an entire partition.

### Architecture

[Component Diagram](https://lucid.app/lucidchart/invitations/accept/1f4d7180-8ad0-492f-afb2-c376aec31d51?viewport_loc=-554%2C-325%2C4041%2C2048%2C0_0)

* API Lambdas sit behind an API Gateway and are decoupled from the Persistence layer. This allows the two layers to 
change independently.
* Create and Update task operations are pulled from an SQS queue to guarantee success. The REST API services can then 
post a message to the queue and respond to the caller with a success message before the data is written.
* Serverless implementation allows units of code to be very small and decoupled from one another.

### Versioning

I created two different versions of data/updateTask for V1 and V2. If both versions need to be supported, then a routing
service may need to be created to resolve which version to execute; this could potentially be done using SNS to fan-out 
messages. If only one version needs to be maintained, then just updating the lambda function in place could suffice.

### TODO

Before being considered production ready, I would:

* Unit Testing
* Not everything would be in a single CloudFormation template
* Permissions are set very wide for this task
