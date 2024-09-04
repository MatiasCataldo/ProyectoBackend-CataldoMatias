import bcrypt from "bcrypt";
import { CartService, UserService } from '../services/service.js';
import { sendInactiveAccountEmail } from "../controllers/email.controller.js"

// OBTENER USUARIOS
export const getUsers = async (req, res) => {
    try {
        const users = await UserService.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor al obtener los usuarios" });
    }
};

// ELIMINAR UN USUARIO
export const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await UserService.getBy(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found with ID: " + userId });
        }
        await CartService.delete(user.cartId);
        await UserService.delete(userId);
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar el usuario" });
    }
}



//ELIMINAR USUARIOS INACTIVOS
export const deleteInactiveUsers = async (req, res) => {
    try {
        const allUsers = await UserService.getAll();

        const now = Date.now(); // Obtener la hora actual

        const usuariosEliminados = []; // Array para almacenar los IDs de los usuarios eliminados

        for (let i = 0; i < allUsers.length; i++) {
            const lastConnection = allUsers[i].last_connection;

            // Verificar si la última conexión es válida y calcular el tiempo transcurrido desde entonces
            if (lastConnection !== null) {
                const lastConnectionDate = new Date(lastConnection);
                const timeSinceLastConnection = now - lastConnectionDate.getTime(); // Tiempo transcurrido en milisegundos
                const hoursSinceLastConnection = timeSinceLastConnection / (1000 * 60 * 60); // Convertir a horas

                // Si han pasado más de 48 horas desde la última conexión, eliminar al usuario
                if (hoursSinceLastConnection > 48) {
                    await sendInactiveAccountEmail(allUsers[i].email); // Enviar correos electrónicos a los usuarios eliminados
                    await CartService.delete(allUsers[i].cartId);
                    await UserService.delete(allUsers[i]._id);
                    usuariosEliminados.push(allUsers[i]); // Agregar el ID del usuario eliminado al array
                }
            }
        }

        res.status(200).json({ eliminados: usuariosEliminados });
    } catch (error) {
        console.error("Error al eliminar usuarios inactivos:", error);
        res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
    }
}



// OBTENER USUARIO POR ID
export const getUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await UserService.getBy(userId);
        if (!user) {
            return res.status(202).json({ message: "User not found with ID: " + userId });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

//OBTENER USUARIO POR EMAIL
export const getUserByEmail = async (req, res) => {
    const userEmail = req.params.email
    try {
        const user = await UserService.getByEmail(userEmail);
        if (!user) {
            return res.status(202).json({ message: "Usuario no encontrado usando email: " + userEmail });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// ACTUALIZAR CONTRASEÑA DEL USUARIO
export const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await UserService.getByEmail({ email });
        if (!user) return res.status(401).json({ status: 'error', error: "Usuario no encontrado" });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ status: "success", payload: req.session.user, message: "Contraseña Modificada con Éxito" });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ status: 'error', error: "Error interno del servidor" });
    }
};

// MODIFICAR USUARIO    
export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { first_name, last_name, email, age } = req.body;
    try {
        const user = await UserService.getBy(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        user.age = age || user.age;

        await user.save();
        return res.status(200).json({ message: `Información del usuario ${userId} actualizada correctamente` });
    } catch (error) {
        console.error('Error al actualizar la información del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};



//SUBIR ARCHIVOS
export const uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await UserService.getBy(userId);

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No se han proporcionado archivos para cargar.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const files = req.files;
        const documents = [];

        for (const key in files) {
            const filesArray = files[key];
        
            for (let i = 0; i < filesArray.length; i++) {
                const file = filesArray[i];
        
                const document = {
                    name: file.originalname,
                    reference: file.path,
                };
                
                documents.push(document);
            }
        }

        user.documents = documents;
        await user.save();

        return res.status(200).json({ message: "Documentos subidos y usuario actualizado correctamente", user });
    } catch (error) {
        console.error('Error al cargar documentos:', error);
        res.status(500).json({ message: 'Error al cargar documentos.', error: error });
    }
};


