// import Razorpay from 'razorpay';
//    import supabase from '../config/supabaseClient.js';

//    // Check if Razorpay credentials are available
//    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
//      throw new Error('Razorpay credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are missing in .env');
//    }

//    const razorpay = new Razorpay({
//      key_id: process.env.RAZORPAY_KEY_ID,
//      key_secret: process.env.RAZORPAY_KEY_SECRET,
//    });

//    export const createOrder = async (req, res) => {
//      try {
//        const { amount, campaignId, userId } = req.body;
//        if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

//        const options = {
//          amount: Math.round(amount * 100), // Convert to paise
//          currency: 'INR',
//          receipt: `donation_${Date.now()}`,
//          payment_capture: 1, // Auto-capture
//        };

//        const order = await razorpay.orders.create(options);

//        const { data, error } = await supabase
//          .from('donations')
//          .insert([
//            {
//              campaign_id: campaignId,
//              donor_user_id: userId,
//              amount,
//              payment_provider: 'razorpay',
//              provider_payment_id: null,
//              status: 'pending',
//              razorpay_order_id: order.id,
//            },
//          ])
//          .select()
//          .single();

//        if (error) return res.status(500).json({ error: error.message });

//        res.json({
//          orderId: order.id,
//          amount: order.amount,
//          currency: order.currency,
//          donationId: data.id,
//        });
//      } catch (error) {
//        res.status(500).json({ error: error.message });
//      }
//    };

//    export const verifyPayment = async (req, res) => {
//      try {
//        const { razorpay_signature, razorpay_payment_id, razorpay_order_id } = req.body;

//        const crypto = require('crypto');
//        const expectedSignature = crypto
//          .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
//          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//          .digest('hex');

//        if (razorpay_signature !== expectedSignature) {
//          return res.status(400).json({ error: 'Invalid signature' });
//        }

//        const { data: donation, error: donationError } = await supabase
//          .from('donations')
//          .update({
//            status: 'paid',
//            provider_payment_id: razorpay_payment_id,
//            razorpay_payment_id,
//            updated_at: new Date(),
//          })
//          .eq('razorpay_order_id', razorpay_order_id)
//          .select()
//          .single();

//        if (donationError) return res.status(500).json({ error: donationError.message });

//        const { error: campaignError } = await supabase.rpc('increment_campaign_amount', {
//          p_campaign_id: donation.campaign_id,
//          p_amount: donation.amount,
//        });

//        if (campaignError) return res.status(500).json({ error: campaignError.message });

//        res.json({ message: 'Payment verified and donation recorded' });
//      } catch (error) {
//        res.status(500).json({ error: error.message });
//      }
//    };