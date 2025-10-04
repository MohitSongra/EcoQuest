import { rewardsService } from '../services/firestoreService';

export const demoRewards = [
  {
    title: '₹100 Amazon Voucher',
    description: 'Get ₹100 Amazon gift voucher to shop for your favorite products',
    type: 'voucher' as const,
    pointsCost: 500,
    value: 100,
    valueType: 'fixed' as const,
    stock: 50,
    status: 'active' as const,
    termsAndConditions: 'Valid for 6 months from date of issue. Non-refundable.'
  },
  {
    title: '20% Off on Flipkart',
    description: 'Get 20% discount on your next Flipkart purchase (max ₹500)',
    type: 'discount' as const,
    pointsCost: 300,
    value: 20,
    valueType: 'percentage' as const,
    stock: 100,
    status: 'active' as const,
    termsAndConditions: 'Maximum discount of ₹500. Valid on orders above ₹1000.'
  },
  {
    title: '₹50 Cashback',
    description: 'Instant ₹50 cashback to your wallet',
    type: 'cashback' as const,
    pointsCost: 200,
    value: 50,
    valueType: 'fixed' as const,
    stock: 200,
    status: 'active' as const,
    termsAndConditions: 'Cashback will be credited within 24 hours.'
  },
  {
    title: 'Free Movie Ticket',
    description: 'Get a free movie ticket at any PVR cinema',
    type: 'coupon' as const,
    pointsCost: 800,
    value: 250,
    valueType: 'fixed' as const,
    stock: 30,
    status: 'active' as const,
    termsAndConditions: 'Valid at all PVR locations. Subject to availability.'
  },
  {
    title: '₹500 Swiggy Voucher',
    description: 'Order your favorite food with ₹500 Swiggy voucher',
    type: 'voucher' as const,
    pointsCost: 1000,
    value: 500,
    valueType: 'fixed' as const,
    stock: 25,
    status: 'active' as const,
    termsAndConditions: 'Valid for 3 months. Cannot be combined with other offers.'
  },
  {
    title: '15% Off on Myntra',
    description: 'Get 15% discount on fashion and lifestyle products',
    type: 'discount' as const,
    pointsCost: 400,
    value: 15,
    valueType: 'percentage' as const,
    stock: 75,
    status: 'active' as const,
    termsAndConditions: 'Valid on orders above ₹1500. Maximum discount ₹750.'
  }
];

export async function seedDemoRewards() {
  try {
    console.log('Seeding demo rewards...');
    for (const reward of demoRewards) {
      await rewardsService.createReward(reward);
      console.log(`Created reward: ${reward.title}`);
    }
    console.log('Demo rewards seeded successfully!');
  } catch (error) {
    console.error('Error seeding rewards:', error);
    throw error;
  }
}
