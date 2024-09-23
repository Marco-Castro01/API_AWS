import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = "Cliente"; // Asegúrate de que el nombre de la tabla sea correcto

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        console.log("AQUI LLEGO 1");
        const nombre = event.pathParameters.nombre; // Nombre del cliente
        console.log("Cliente Nombre:", nombre);

        const params = {
            TableName: tableName,
            IndexName: "nombre-index", // Asegúrate de que este índice esté creado en DynamoDB
            KeyConditionExpression: "nombre = :nombre",
            ExpressionAttributeValues: {
                ":nombre": nombre,
            },
        };

        const data = await docClient.send(new QueryCommand(params));
        console.log('Result:', JSON.stringify(data));

        if (data.Items.length === 0) {
            statusCode = 404; // Cliente no encontrado
            body = JSON.stringify({ message: 'Cliente no encontrado' });
        } else {
            body = JSON.stringify(data.Items);
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
