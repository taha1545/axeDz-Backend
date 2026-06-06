'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('email_logs', {
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
      to_email: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      body_type: {
        type: Sequelize.ENUM('text', 'html'),
        allowNull: false,
        defaultValue: 'text',
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

    await queryInterface.addIndex('email_logs', ['api_key_id'], {
      name: 'idx_email_logs_api_key_id',
    });

    await queryInterface.addIndex('email_logs', ['created_at'], {
      name: 'idx_email_logs_created_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('email_logs');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_email_logs_body_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_email_logs_status";');
  }
};