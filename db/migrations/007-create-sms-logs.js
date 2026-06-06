'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sms_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      api_key_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'api_keys',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      to_number: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      callback_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      callback_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('queued', 'sent', 'failed'),
        defaultValue: 'queued',
      },
      retry_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('sms_logs', ['api_key_id'], {
      name: 'idx_sms_logs_api_key_id',
    });

    await queryInterface.addIndex('sms_logs', ['created_at'], {
      name: 'idx_sms_logs_created_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sms_logs');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_sms_logs_status";');
  }
};