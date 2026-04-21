from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import mysql.connector
from mysql.connector import Error
import uuid
from datetime import datetime, timedelta
import re

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
    "password": "root",
    "database": "monitoreo_vial"
}

class LoginRequest(BaseModel):
    email: str
    password: str

class CreateUserRequest(BaseModel):
    nombre: str
    correo: str
    password: str
    id_rol: int

    @validator('correo')
    def validate_email(cls, v):
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', v):
            raise ValueError('El correo electrónico debe contener un @ y un dominio válido')
        return v

class UpdateUserRequest(BaseModel):
    nombre: str | None = None
    correo: str | None = None
    password: str | None = None
    activo: bool | None = None
    id_rol: int | None = None

    @validator('correo')
    def validate_email(cls, v):
        if v is not None and not re.match(r'^[^@]+@[^@]+\.[^@]+$', v):
            raise ValueError('El correo electrónico debe contener un @ y un dominio válido')
        return v

def verify_session(token: str):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT id_usuario, fecha_expiracion
            FROM sesion
            WHERE token = %s AND fecha_expiracion > NOW()
        """
        cursor.execute(query, (token,))
        session = cursor.fetchone()

        if not session:
            raise HTTPException(status_code=401, detail="Sesión inválida o expirada")

        return session['id_usuario']

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/usuarios")
def get_usuarios(token: str = Depends(verify_session)):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT u.id_usuario, u.nombre, u.correo, u.activo, u.fecha_creacion, r.nombre as rol_nombre
            FROM usuario u
            JOIN rol r ON u.id_rol = r.id_rol
            ORDER BY u.fecha_creacion DESC
        """
        cursor.execute(query)
        usuarios = cursor.fetchall()

        return usuarios

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/roles")
def get_roles(token: str = Depends(verify_session)):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = "SELECT id_rol, nombre FROM rol ORDER BY nombre"
        cursor.execute(query)
        roles = cursor.fetchall()

        return roles

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.post("/usuarios")
def create_usuario(user: CreateUserRequest, token: str = Depends(verify_session)):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Verificar si el correo ya existe
        check_query = "SELECT id_usuario FROM usuario WHERE correo = %s"
        cursor.execute(check_query, (user.correo,))
        existing_user = cursor.fetchone()

        if existing_user:
            raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado")

        # Crear el usuario
        insert_query = """
            INSERT INTO usuario (nombre, correo, contraseña_hash, id_rol, activo, fecha_creacion)
            VALUES (%s, %s, %s, %s, TRUE, NOW())
        """
        cursor.execute(insert_query, (user.nombre, user.correo, user.password, user.id_rol))
        connection.commit()

        return {"message": "Usuario creado exitosamente"}

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.put("/usuarios/{id_usuario}")
def update_usuario(id_usuario: int, user: UpdateUserRequest, token: str = Depends(verify_session)):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Construir la consulta de actualización dinámicamente
        update_fields = []
        values = []

        if user.nombre is not None:
            update_fields.append("nombre = %s")
            values.append(user.nombre)
        if user.correo is not None:
            update_fields.append("correo = %s")
            values.append(user.correo)
        if user.password is not None:
            update_fields.append("contraseña_hash = %s")
            values.append(user.password)
        if user.activo is not None:
            update_fields.append("activo = %s")
            values.append(user.activo)
        if user.id_rol is not None:
            update_fields.append("id_rol = %s")
            values.append(user.id_rol)

        if not update_fields:
            raise HTTPException(status_code=400, detail="No se proporcionaron campos para actualizar")

        values.append(id_usuario)
        update_query = f"UPDATE usuario SET {', '.join(update_fields)} WHERE id_usuario = %s"
        cursor.execute(update_query, values)
        connection.commit()

        return {"message": "Usuario actualizado exitosamente"}

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.delete("/usuarios/{id_usuario}")
def delete_usuario(id_usuario: int, token: str = Depends(verify_session)):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Verificar si es el único administrador activo
        admin_check_query = """
            SELECT COUNT(*) as admin_count
            FROM usuario u
            JOIN rol r ON u.id_rol = r.id_rol
            WHERE r.nombre = 'Administrador' AND u.activo = TRUE
        """
        cursor.execute(admin_check_query)
        result = cursor.fetchone()

        # Verificar si el usuario a eliminar es administrador
        user_role_query = """
            SELECT r.nombre as rol_nombre
            FROM usuario u
            JOIN rol r ON u.id_rol = r.id_rol
            WHERE u.id_usuario = %s
        """
        cursor.execute(user_role_query, (id_usuario,))
        user_role = cursor.fetchone()

        if user_role and user_role['rol_nombre'] == 'Administrador' and result['admin_count'] <= 1:
            raise HTTPException(status_code=400, detail="No se puede eliminar al único administrador del sistema")

        # Eliminar el usuario
        delete_query = "DELETE FROM usuario WHERE id_usuario = %s"
        cursor.execute(delete_query, (id_usuario,))
        connection.commit()

        return {"message": "Usuario eliminado exitosamente"}

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/me")
def get_me(token: str):
    user_id = verify_session(token)
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT u.id_usuario, u.nombre, u.correo, u.activo, u.fecha_creacion, r.nombre as rol_nombre
            FROM usuario u
            JOIN rol r ON u.id_rol = r.id_rol
            WHERE u.id_usuario = %s
        """
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return user

    except Error as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Error de servidor")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.post("/login")
def login(credentials: LoginRequest, request: Request):
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Consulta ajustada a tu tabla 'usuario' y unión con 'rol'
        query = """
            SELECT u.id_usuario, u.nombre, u.correo, u.contraseña_hash, r.nombre as rol_nombre, r.id_rol
            FROM usuario u
            JOIN rol r ON u.id_rol = r.id_rol
            WHERE u.correo = %s AND u.activo = TRUE
        """
        cursor.execute(query, (credentials.email,))
        user = cursor.fetchone()

        if user and user['contraseña_hash'] == credentials.password:
            # Generar token de sesión
            token = str(uuid.uuid4())
            fecha_inicio = datetime.now()
            fecha_expiracion = fecha_inicio + timedelta(minutes=60)
            ip_acceso = request.client.host if request.client else "unknown"

            # Insertar sesión en la base de datos
            session_query = """
                INSERT INTO sesion (id_usuario, token, fecha_inicio, fecha_expiracion, ip_acceso)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(session_query, (user['id_usuario'], token, fecha_inicio, fecha_expiracion, ip_acceso))
            connection.commit()

            return {
                "success": True,
                "user": {
                    "id": user['id_usuario'],
                    "nombre": user['nombre'],
                    "rol": user['rol_nombre'],
                    "id_rol": user['id_rol']
                },
                "token": token
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
