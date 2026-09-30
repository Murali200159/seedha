import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, CheckCircle2, TrendingUp, Building2, ChevronRight } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

type Step = 'landing' | 'basic' | 'income' | 'results' | 'lenders' | 'apply';

const lenders = [
  { name: 'SBI Home Loans', rate: '8.40%', emi: '43,000', maxLoan: '1.5 Cr' },
  { name: 'HDFC Bank', rate: '8.50%', emi: '43,450', maxLoan: '1.2 Cr' },
  { name: 'ICICI Bank', rate: '8.60%', emi: '43,900', maxLoan: '1.0 Cr' },
  { name: 'Axis Bank', rate: '8.75%', emi: '44,500', maxLoan: '90 L' },
  { name: 'LIC HFL', rate: '8.35%', emi: '42,800', maxLoan: '80 L' },
];

export default function HomeLoanScreen() {
  const { pop } = useApp();
  const [step, setStep] = useState<Step>('landing');
  const [form, setForm] = useState({
    name: '', phone: '', income: '', employment: '',
    loanAmount: '', tenure: '20', propertyValue: '',
  });
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const calculateEMI = () => {
    const P = parseInt(form.loanAmount.replace(/,/g, '')) || 5000000;
    const r = 0.085 / 12;
    const n = parseInt(form.tenure) * 12;
    return Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const emi = calculateEMI();

  if (applied) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successBadgeCircle}>
          <CheckCircle2 size={40} color="#16A34A" />
        </View>
        <Text style={styles.successTitle}>Application Submitted!</Text>
        <Text style={styles.successSub}>
          Our loan advisor will contact you within 2 hours to guide you through the next steps.
        </Text>
        <TouchableOpacity onPress={pop} style={styles.backHomeButton} activeOpacity={0.8}>
          <Text style={styles.backHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={step === 'landing' ? pop : () => setStep('landing')} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Home Loan</Text>
          {step !== 'landing' && <Text style={styles.headerSub}>{step} details</Text>}
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {step === 'landing' && (
          <View style={styles.sectionPadding}>
            <View style={styles.heroBanner}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=300&fit=crop' }} style={styles.heroImage} />
              <View style={styles.heroOverlay} />
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Get the Best Home Loan Rates</Text>
                <Text style={styles.heroSub}>Starting from 8.35% p.a.</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              {[
                { val: '8.35%', label: 'Best Rate' },
                { val: '₹99', label: 'Processing' },
                { val: '48hr', label: 'Approval' },
              ].map(({ val, label }) => (
                <View key={label} style={styles.statCard}>
                  <Text style={styles.statVal}>{val}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.optionsWrap}>
              <TouchableOpacity onPress={() => setStep('basic')} style={styles.optionCard} activeOpacity={0.8}>
                <View style={[styles.optionIconBox, { backgroundColor: '#EBF0FF' }]}>
                  <TrendingUp size={22} color="#2260FF" />
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionTitle}>Check Eligibility</Text>
                  <Text style={styles.optionSub}>2-min quick assessment</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep('lenders')} style={styles.optionCard} activeOpacity={0.8}>
                <View style={[styles.optionIconBox, { backgroundColor: '#EDE9FE' }]}>
                  <Building2 size={22} color="#7C3AED" />
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionTitle}>Compare Lenders</Text>
                  <Text style={styles.optionSub}>10+ banks & NBFCs</Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 'basic' && (
          <View style={styles.sectionPadding}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Rahul Sharma"
                placeholderTextColor="#9CA3AF"
                value={form.name}
                onChangeText={text => setForm(f => ({ ...f, name: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="+91 98765 43210"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={text => setForm(f => ({ ...f, phone: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Monthly Income (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="80,000"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={form.income}
                onChangeText={text => setForm(f => ({ ...f, income: text }))}
              />
            </View>
          </View>
        )}

        {step === 'income' && (
          <View style={styles.sectionPadding}>
            <Text style={styles.stepTitle}>Loan Requirements</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Loan Amount Required (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="50,00,000"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={form.loanAmount}
                onChangeText={text => setForm(f => ({ ...f, loanAmount: text }))}
              />
            </View>
          </View>
        )}

        {step === 'lenders' && (
          <View style={styles.sectionPadding}>
            <Text style={styles.stepTitle}>Compare Loan Offers</Text>
            <View style={styles.lendersList}>
              {lenders.map(l => (
                <View key={l.name} style={styles.lenderCard}>
                  <View style={styles.lenderRow}>
                    <Text style={styles.lenderName}>{l.name}</Text>
                    <Text style={styles.lenderRate}>{l.rate}</Text>
                  </View>
                  <View style={styles.lenderMeta}>
                    <Text style={styles.lenderMetaText}>EMI: ₹{l.emi}/mo</Text>
                    <Text style={styles.lenderMetaText}>Max Loan: {l.maxLoan}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setStep('apply')} style={styles.applySmallBtn}>
                    <Text style={styles.applySmallText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 'apply' && (
          <View style={styles.sectionPadding}>
            <Text style={styles.stepTitle}>Complete Application</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>PAN Card Number</Text>
              <TextInput style={styles.textInput} placeholder="ABCDE1234F" placeholderTextColor="#9CA3AF" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'basic') setStep('income');
            else if (step === 'income') { setLoading(true); setTimeout(() => { setLoading(false); setStep('results'); }, 1000); }
            else if (step === 'results') setStep('lenders');
            else if (step === 'apply') { setLoading(true); setTimeout(() => { setLoading(false); setApplied(true); }, 1200); }
            else setStep('basic');
          }}
          disabled={loading}
          style={styles.mainButton}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.mainButtonText}>{step === 'landing' ? 'Check Eligibility' : step === 'apply' ? 'Submit Application' : 'Continue'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEEF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  headerTitleCol: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  scrollArea: {
    flex: 1,
  },
  sectionPadding: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  heroBanner: {
    height: 130,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 16, 66, 0.6)',
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSub: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2260FF',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  optionsWrap: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    elevation: 1,
  },
  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  optionSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: '#111827',
    elevation: 1,
  },
  lendersList: {
    gap: 10,
  },
  lenderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    elevation: 1,
  },
  lenderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lenderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  lenderRate: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2260FF',
  },
  lenderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  lenderMetaText: {
    fontSize: 11,
    color: '#6B7280',
  },
  applySmallBtn: {
    backgroundColor: '#2260FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  applySmallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  mainButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#ECEEF5',
  },
  successBadgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  backHomeButton: {
    marginTop: 24,
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
