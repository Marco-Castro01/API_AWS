import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Cliente";

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        console.log("AQUI LLEGO 1");
        const cedula = event.pathParameters.cedula; // Suponiendo que también pasas el nombre
        console.log("Cliente ID:", cedula);
        console.log("Cliente cedula:", cedula);

        const params = {
            TableName: tableName,
            Key: {
                id:cedula,
                cedula: cedula,   // Sort Key
            },
        };

        const data = await docClient.send(new GetCommand(params));
        console.log('Result:', JSON.stringify(data));

        if (!data.Item) {
            statusCode = 404; // Cliente no encontrado
            body = JSON.stringify({ message: 'Cliente no encontrado' });
        } else {
            body = JSON.stringify(data.Item);
        }

    } catch (err) {
        console.error("Error:", err);
        statusCode = 500; // Cambia a 500 para errores internos del servidor
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
