const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

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
        const nombre = event.pathParameters.nombre;

        const params = {
            TableName: tableName,
            IndexName: "nombre-index",
            KeyConditionExpression: "nombre = :nombre",
            ExpressionAttributeValues: {
                ":nombre": nombre,
            },
        };

        const data = await docClient.send(new QueryCommand(params));

        if (data.Items.length === 0) {
            statusCode = 404;
            body = JSON.stringify({ message: 'Cliente no encontrado' });
        } else {
            body = JSON.stringify(data.Items);
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
