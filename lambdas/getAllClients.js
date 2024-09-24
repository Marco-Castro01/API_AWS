const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

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
        const result = await docClient.send(new ScanCommand({ TableName: tableName }));

        if (!result.Items || result.Items.length === 0) {
            throw new Error("No items found in the table.");
        }

        body = result.Items;
    } catch (err) {
        statusCode = 400;
        body = {
            error: err.name,
            message: err.message,
            details: err.stack,
        };
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
