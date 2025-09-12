const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');

/**
 * GET /api/transactions
 * Query params: page, limit, sort, order, school_id, status
 */
exports.getTransactions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20')));
    const skip = (page - 1) * limit;
    const sortField = req.query.sort || 'payment_time';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;

    const matchOrder = {};
    if(req.query.school_id) matchOrder.school_id = req.query.school_id;

    // Aggregation pipeline: lookup OrderStatus
    const pipeline = [
      { $match: matchOrder },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status_docs'
        }
      },
      { $unwind: { path: '$status_docs', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$status_docs.gateway',
          order_amount: '$status_docs.order_amount',
          transaction_amount: '$status_docs.transaction_amount',
          status: '$status_docs.status',
          custom_order_id: '$custom_order_id',
          payment_time: '$status_docs.payment_time'
        }
      }
    ];

    // Apply status filter if provided
    if(req.query.status) {
      pipeline.push({ $match: { status: req.query.status } });
    }

    // Sorting
    const sortObj = {};
    sortObj[sortField] = sortOrder;
    pipeline.push({ $sort: sortObj });

    // Pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    const data = await Order.aggregate(pipeline);

    // total count (matching orders)
    const total = await Order.countDocuments(matchOrder);

    res.json({ page, limit, total, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTransactionsBySchool = async (req, res) => {
  try {
    const schoolId = req.params.schoolId;
    const pipeline = [
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status_docs'
        }
      },
      { $unwind: { path: '$status_docs', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$status_docs.gateway',
          order_amount: '$status_docs.order_amount',
          transaction_amount: '$status_docs.transaction_amount',
          status: '$status_docs.status',
          custom_order_id: '$custom_order_id',
          payment_time: '$status_docs.payment_time'
        }
      },
      { $sort: { payment_time: -1 } }
    ];

    const data = await Order.aggregate(pipeline);
    res.json({ total: data.length, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkTransactionStatus = async (req, res) => {
  try {
    const customOrderId = req.params.custom_order_id;
    // find order by custom_order_id
    const order = await Order.findOne({ custom_order_id: customOrderId });
    if(!order) return res.status(404).json({ message: 'Order not found' });

    const statusDoc = await OrderStatus.findOne({ collect_id: order._id });
    if(!statusDoc) return res.json({ custom_order_id: customOrderId, status: 'not_found' });

    return res.json({
      custom_order_id: customOrderId,
      status: statusDoc.status,
      order_amount: statusDoc.order_amount,
      transaction_amount: statusDoc.transaction_amount,
      payment_time: statusDoc.payment_time,
      gateway: statusDoc.gateway,
      bank_reference: statusDoc.bank_reference
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
