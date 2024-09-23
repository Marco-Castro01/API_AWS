import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "Cliente";  // Cambia el nombre de la tabla según corresponda

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        const result = await dynamo.send(
            new ScanCommand({
                TableName: tableName, // Escanea todos los registros de la tabla
            })
        );

        if (!result.Items || result.Items.length === 0) {
            throw new Error("No items found in the table.");
        }

        body = result.Items; // Devuelve todos los registros
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
