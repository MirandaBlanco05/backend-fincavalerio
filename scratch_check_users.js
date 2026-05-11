const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('postgresql://finca_valerio_user:q9jnlroHSN6ckogBW6tqBx7Rga01zdkK@dpg-d7t522ok1i2s73ac1i80-a.oregon-postgres.render.com/finca_valerio', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const Login = sequelize.define('Login', {
  id_login: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo_usuario: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'LOGIN',
  timestamps: false
});

async function run() {
  try {
    await sequelize.authenticate();
    
    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('Daniela', saltRounds);
    
    // Update Admin password
    await Login.update(
      { contrasena: hashedPassword },
      { where: { usuario: 'Admin' } }
    );
    
    // Update Daniel password (just in case they also use Daniela for Daniel)
    await Login.update(
      { contrasena: hashedPassword },
      { where: { usuario: 'Daniel' } }
    );
    
    console.log('Passwords for Admin and Daniel have been set to Daniela');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

run();
