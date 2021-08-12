module.exports = (sequelize, DataType) => {
  return sequelize.define(
    'user',
    {
      name: {
        type: DataType.STRING(40),
        allowNull: false,
        primaryKey: true
      },
      age: {
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false
      }
    },
    {
      timestamps: false
    }
  );
};
