const db = require('@db/models');
const { ValidationError } = require('@errors');

const DEFAULT_LIMIT = 20;

const getTransactionHistory = async (req, res, next) => {
  //
  const userId = req.user.id;
  if (!userId) {
    throw new ValidationError('userId is required');
  }
  //
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 1);
  const offset = (page - 1) * limit;
  //
  const { rows, count: totalItems } = await db.Transaction.findAndCountAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });
  const transactions = rows;
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
  //
  return res.status(200).json({
    success: true,
    data: {
      transactions,
      pagination: {
        page,
        limit,
        total_items: totalItems,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_previous_page: page > 1,
      },
    },
    message: 'Transaction history fetched successfully',
  });
};

module.exports = {
  getTransactionHistory,
};
