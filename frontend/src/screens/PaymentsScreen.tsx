import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  Landmark,
  ReceiptIndianRupee,
  ShieldCheck,
  WalletCards,
} from 'lucide-react-native';

const transactions = [
  {
    id: 'SP240812',
    title: 'Rental Agreement',
    detail: 'Madhapur, Hyderabad',
    amount: '₹589',
    date: '12 Aug 2024',
    status: 'Paid',
    icon: FileText,
  },
  {
    id: 'SP240728',
    title: 'Property Visit',
    detail: 'Gachibowli, Hyderabad',
    amount: '₹199',
    date: '28 Jul 2024',
    status: 'Paid',
    icon: Landmark,
  },
];

export default function PaymentsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
        <Text style={styles.headerSub}>Manage dues and payment history</Text>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.cardPadding}>
          <View style={styles.dueCard}>
            <View style={styles.dueRow}>
              <View>
                <Text style={styles.dueLabel}>Total due</Text>
                <Text style={styles.dueAmount}>₹12,500</Text>
                <Text style={styles.dueSub}>Maintenance payment due by 25 Aug</Text>
              </View>
              <View style={styles.walletIconBox}>
                <WalletCards size={23} color="white" />
              </View>
            </View>

            <TouchableOpacity style={styles.payButton} activeOpacity={0.9}>
              <Text style={styles.payButtonText}>Pay securely</Text>
              <ArrowUpRight size={16} color="#2260FF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Options */}
        <View style={styles.cardPadding}>
          <View style={styles.optionsGrid}>
            <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
              <View style={styles.optionIconBox}>
                <CreditCard size={19} color="#2260FF" />
              </View>
              <Text style={styles.optionTitle}>Payment methods</Text>
              <Text style={styles.optionSub}>Cards, UPI and banks</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard} activeOpacity={0.8}>
              <View style={[styles.optionIconBox, { backgroundColor: '#DCFCE7' }]}>
                <ReceiptIndianRupee size={19} color="#16A34A" />
              </View>
              <Text style={styles.optionTitle}>Receipts</Text>
              <Text style={styles.optionSub}>View and download</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.cardPadding}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent payments</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listWrap}>
            {transactions.map(({ id, title, detail, amount, date, status, icon: Icon }) => (
              <TouchableOpacity key={id} style={styles.transCard} activeOpacity={0.8}>
                <View style={styles.transIconBox}>
                  <Icon size={19} color="#2260FF" />
                </View>
                <View style={styles.transContent}>
                  <Text style={styles.transTitle}>{title}</Text>
                  <Text style={styles.transDetail} numberOfLines={1}>{detail}</Text>
                  <View style={styles.statusRow}>
                    {status === 'Paid' ? <CheckCircle2 size={11} color="#16A34A" /> : <Clock3 size={11} color="#D97706" />}
                    <Text style={styles.statusText}>{status} · {date}</Text>
                  </View>
                </View>
                <View style={styles.amountCol}>
                  <Text style={styles.amountText}>{amount}</Text>
                  <Text style={styles.idText}>{id}</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.securityBox}>
            <ShieldCheck size={16} color="#16A34A" />
            <Text style={styles.securityText}>Your payments are protected with bank-grade encryption.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEEF5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  headerSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  cardPadding: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dueCard: {
    backgroundColor: '#2260FF',
    borderRadius: 24,
    padding: 20,
    elevation: 3,
  },
  dueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dueLabel: {
    fontSize: 12,
    color: '#BFDBFE',
  },
  dueAmount: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  dueSub: {
    fontSize: 11,
    color: '#BFDBFE',
    marginTop: 4,
  },
  walletIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButton: {
    marginTop: 18,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2260FF',
    marginRight: 6,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    elevation: 2,
  },
  optionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  optionSub: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2260FF',
  },
  listWrap: {
    gap: 10,
  },
  transCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    elevation: 1,
  },
  transIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transContent: {
    flex: 1,
    marginLeft: 10,
  },
  transTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  transDetail: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
    marginLeft: 4,
  },
  amountCol: {
    alignItems: 'flex-end',
    marginRight: 6,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  idText: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
  },
  securityText: {
    fontSize: 11,
    color: '#15803D',
    marginLeft: 6,
    flex: 1,
  },
});
