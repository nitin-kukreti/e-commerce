'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove the quantity column from the Carts table
    await queryInterface.removeColumn('Carts', 'quantity');
  },

  async down (queryInterface, Sequelize) {
    // Add the quantity column back to the Carts table
    await queryInterface.addColumn('Carts', 'quantity', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    });
  }
};
