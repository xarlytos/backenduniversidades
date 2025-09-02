const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// URI de MongoDB Atlas (la misma que usas en Railway)
const MONGODB_URI = 'mongodb+srv://carlosgarrote:Garrote123@xarlytos.etwujsw.mongodb.net/xarlytos?retryWrites=true&w=majority&appName=xarlytos';

async function crearAdminUsuario() {
  try {
    console.log('🔗 Conectando a MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Definir esquema de usuario (debe coincidir con tu modelo)
    const usuarioSchema = new mongoose.Schema({
      nombre: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true },
      rol: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
      estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
      activo: { type: Boolean, default: true }
    }, { timestamps: true });

    const Usuario = mongoose.model('Usuario', usuarioSchema);

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ email: 'admin@universidades.com' });
    if (adminExistente) {
      console.log('⚠️  Usuario admin ya existe:', adminExistente.email);
      console.log('📧 Email:', adminExistente.email);
      console.log('👤 Nombre:', adminExistente.nombre);
      console.log('🔑 Rol:', adminExistente.rol);
      await mongoose.disconnect();
      return;
    }

    // Crear hash de la contraseña
    console.log('🔐 Creando hash de contraseña...');
    const passwordHash = await bcrypt.hash('admin123', 12);

    // Crear usuario administrador
    const adminUser = new Usuario({
      nombre: 'Administrador',
      email: 'admin@universidades.com',
      passwordHash: passwordHash,
      rol: 'ADMIN',
      estado: 'ACTIVO',
      activo: true
    });

    await adminUser.save();
    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('📧 Email: admin@universidades.com');
    console.log('🔑 Contraseña: admin123');
    console.log('👤 Rol: ADMIN');

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
    process.exit(1);
  }
}

crearAdminUsuario();