const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Cliente";

exports.handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        const cedula = event.pathParameters.cedula;

        const params = {
            TableName: tableName,
            Key: {
                id: cedula,
                cedula: cedula,
            },
        };

        const data = await docClient.send(new GetCommand(params));

        if (!data.Item) {
            statusCode = 404;
            body = JSON.stringify({ message: 'Cliente no encontrado' });
        } else {
            body = JSON.stringify(data.Item);
        }

    } catch (err) {
        statusCode = 500;
        body = JSON.stringify({
            error: err.name,
            message: err.message,
            details: err.stack,
        });
    }

    return {
        statusCode,
        body,
        headers,
    };
};
