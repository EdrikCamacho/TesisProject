from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from mysql.connector import Error

app = FastAPI()

# Configuración de CORS para que React pueda comunicarse
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de tu DB MySQL 8
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "1234",
    "database": "monitoreo_vial"
}

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(credentials: LoginRequest):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Consulta ajustada a tu tabla 'usuario' y unión con 'rol'
        query = """
            SELECT u.id_usuario, u.nombre, u.correo, u.contraseña_hash, r.nombre as rol_nombre 
            FROM usuario u
            JOIN rol r ON u.id_rol = r.id_rol
            WHERE u.correo = %s AND u.activo = TRUE
        """
        cursor.execute(query, (credentials.email,))
        user = cursor.fetchone()

        if user and user['contraseña_hash'] == credentials.password:
            # Aquí podrías generar un token de sesión e insertarlo en tu tabla 'sesion'
            return {
                "success": True,
                "user": {
                    "id": user['id_usuario'],
                    "nombre": user['nombre'],
                    "rol": user['rol_nombre']
                }
            }
        else:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()