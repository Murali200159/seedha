import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  ChevronLeft,
  CheckCircle2,
  TrendingUp,
  Building2,
  ChevronRight,
  Calculator,
  FileText,
  Phone,
  MessageCircle,
  ShieldCheck,
  Check,
  ArrowRight,
  Landmark,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';

type Step = 'loanType' | 'calculator' | 'eligibility' | 'compare' | 'documents' | 'contactAdvisor';

const loanTypes = [
  { id: 'purchase', title: 'New Home Purchase Loan', sub: 'For buying flats, villas or ready homes', rate: '8.35%' },
  { id: 'construction', title: 'Home Construction / Renovation', sub: 'Build your dream home on owned land', rate: '8.45%' },
  { id: 'transfer', title: 'Balance Transfer / Refinance', sub: 'Switch your existing loan to lower EMI', rate: '8.40%' },
  { id: 'lap', title: 'Loan Against Property (LAP)', sub: 'Unlock funds against your residential property', rate: '9.20%' },
  { id: 'commercial', title: 'Commercial Property Loan', sub: 'Financing for office and retail spaces', rate: '9.50%' },
];

const bankOffers = [
  { bank: 'SBI Home Loans', rate: '8.40%', emi: '₹43,000', max: '₹1.5 Cr', fee: '₹2,000 flat', badge: 'Lowest Rate' },
  { bank: 'HDFC Bank', rate: '8.50%', emi: '₹43,450', max: '₹1.2 Cr', fee: '0.25% of loan', badge: 'Fast Sanction' },
  { bank: 'ICICI Bank', rate: '8.60%', emi: '₹43,900', max: '₹1.0 Cr', fee: '0.50% of loan', badge: 'Pre-Approved' },
  { bank: 'Axis Bank', rate: '8.75%', emi: '₹44,500', max: '₹90 Lakh', fee: '₹5,000 flat', badge: 'Special Salaried' },
  { bank: 'LIC Housing Finance', rate: '8.35%', emi: '₹42,800', max: '₹80 Lakh', fee: 'Nil for 30L', badge: 'Government Backed' },
];

export default function HomeLoanScreen() {
  const { pop, setTab, addAdminRequest } = useApp();
  const [step, setStep] = useState<Step>('loanType');
  const [selectedLoanType, setSelectedLoanType] = useState('purchase');

  // EMI Calculator State
  const [amount, setAmount] = useState('5000000');
  const [rate, setRate] = useState('8.5');
  const [tenureYears, setTenureYears] = useState('20');

  // Eligibility Checker State
  const [monthlyIncome, setMonthlyIncome] = useState('95000');
  const [existingEmi, setExistingEmi] = useState('10000');
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self_employed'>('salaried');

  // Selected Bank
  const [selectedBank, setSelectedBank] = useState('SBI Home Loans');

  // Calculations
  const P = parseFloat(amount) || 5000000;
  const r = (parseFloat(rate) || 8.5) / (12 * 100);
  const n = (parseInt(tenureYears) || 20) * 12;
  const monthlyEmi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) || 0;
  const totalPayment = monthlyEmi * n;
  const totalInterest = totalPayment - P;

  // Eligibility calculation (approx 55% FOIR)
  const income = parseFloat(monthlyIncome) || 95000;
  const emiObligation = parseFloat(existingEmi) || 10000;
  const maxAvailableEmi = Math.max(0, income * 0.55 - emiObligation);
  const eligibleAmount = Math.round((maxAvailableEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))) || 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'loanType') pop();
            else if (step === 'calculator') setStep('loanType');
            else if (step === 'eligibility') setStep('calculator');
            else if (step === 'compare') setStep('eligibility');
            else if (step === 'documents') setStep('compare');
            else if (step === 'contactAdvisor') setStep('documents');
          }}
          style={styles.backCircle}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Home Loans</Text>
          <Text style={styles.headerSub}>
            {step === 'loanType'
              ? 'Select Loan Type'
              : step === 'calculator'
              ? 'EMI Calculator'
              : step === 'eligibility'
              ? 'Eligibility Checker'
              : step === 'compare'
              ? 'Compare Bank Loans'
              : step === 'documents'
              ? 'Required Documents'
              : 'Loan Assistance Provider'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Step 1: User Selects Loan Type */}
        {step === 'loanType' && (
          <View style={styles.contentPadding}>
            <View style={styles.heroCard}>
              <View style={styles.badgeRow}>
                <Landmark size={16} color={colors.primary} />
                <Text style={styles.badgeText}>LOWEST INTEREST GUARANTEE</Text>
              </View>
              <Text style={styles.heroTitle}>Select Your Loan Type</Text>
              <Text style={styles.heroSub}>
                Get pre-approved rates starting from 8.35% with zero processing fee offers from India's top lenders.
              </Text>
            </View>

            <View style={styles.loanTypeList}>
              {loanTypes.map(item => {
                const isSelected = selectedLoanType === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setSelectedLoanType(item.id)}
                    style={[styles.loanTypeCard, isSelected && styles.loanTypeCardActive]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.loanTypeHeader}>
                      <Text style={[styles.loanTypeTitle, isSelected && { color: colors.primary }]}>
                        {item.title}
                      </Text>
                      <View style={[styles.rateBadge, isSelected && { backgroundColor: colors.primary }]}>
                        <Text style={[styles.rateBadgeText, isSelected && { color: colors.textWhite }]}>
                          from {item.rate}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.loanTypeSub}>{item.sub}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => setStep('calculator')}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Continue to EMI Calculator</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: EMI Calculator */}
        {step === 'calculator' && (
          <View style={styles.contentPadding}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step 2 of 6: Calculate Monthly EMI</Text>
            </View>

            <View style={styles.emiHighlightCard}>
              <Text style={styles.emiHighlightLabel}>Estimated Monthly EMI</Text>
              <Text style={styles.emiHighlightValue}>₹{monthlyEmi.toLocaleString('en-IN')}</Text>
              <View style={styles.emiMetaRow}>
                <View style={styles.emiMetaItem}>
                  <Text style={styles.emiMetaKey}>Principal Loan</Text>
                  <Text style={styles.emiMetaVal}>₹{P.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.emiMetaItem}>
                  <Text style={styles.emiMetaKey}>Total Interest</Text>
                  <Text style={styles.emiMetaVal}>₹{Math.max(0, totalInterest).toLocaleString('en-IN')}</Text>
                </View>
              </View>
            </View>

            <View style={styles.calcField}>
              <Text style={styles.inputLabel}>Loan Amount (₹)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <View style={styles.quickChipRow}>
                {['3000000', '5000000', '7500000', '10000000'].map(val => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => setAmount(val)}
                    style={[styles.quickChip, amount === val && styles.quickChipActive]}
                  >
                    <Text style={[styles.quickChipText, amount === val && styles.quickChipTextActive]}>
                      ₹{(parseInt(val) / 100000).toFixed(0)} Lakh
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.calcField}>
              <Text style={styles.inputLabel}>Interest Rate (% p.a.)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={rate}
                onChangeText={setRate}
              />
            </View>

            <View style={styles.calcField}>
              <Text style={styles.inputLabel}>Loan Tenure (Years)</Text>
              <View style={styles.chipRow}>
                {['10', '15', '20', '25', '30'].map(y => (
                  <TouchableOpacity
                    key={y}
                    onPress={() => setTenureYears(y)}
                    style={[styles.tenureChip, tenureYears === y && styles.tenureChipActive]}
                  >
                    <Text style={[styles.tenureChipText, tenureYears === y && styles.tenureChipTextActive]}>
                      {y} Yrs
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setStep('eligibility')}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Check Eligibility</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Eligibility Checker */}
        {step === 'eligibility' && (
          <View style={styles.contentPadding}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step 3 of 6: Check Your Loan Eligibility</Text>
            </View>

            <View style={styles.eligibilityResultCard}>
              <CheckCircle2 size={32} color={colors.secondary} />
              <Text style={styles.eligibilityCongrats}>Congratulations!</Text>
              <Text style={styles.eligibilitySub}>Based on your income, you are eligible for up to:</Text>
              <Text style={styles.eligibilityAmount}>₹{eligibleAmount.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Employment Type</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  onPress={() => setEmploymentType('salaried')}
                  style={[styles.toggleBtn, employmentType === 'salaried' && styles.toggleBtnActive]}
                >
                  <Text style={[styles.toggleText, employmentType === 'salaried' && styles.toggleTextActive]}>
                    Salaried Employee
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEmploymentType('self_employed')}
                  style={[styles.toggleBtn, employmentType === 'self_employed' && styles.toggleBtnActive]}
                >
                  <Text style={[styles.toggleText, employmentType === 'self_employed' && styles.toggleTextActive]}>
                    Self-Employed / Business
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Monthly Net Salary / Income (₹)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Existing Monthly EMIs / Loans (₹)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={existingEmi}
                onChangeText={setExistingEmi}
              />
            </View>

            <TouchableOpacity
              onPress={() => setStep('compare')}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Compare Bank Loans</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Compare Bank Loans */}
        {step === 'compare' && (
          <View style={styles.contentPadding}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step 4 of 6: Compare Bank Offers</Text>
            </View>

            <Text style={styles.sectionHeading}>Top Banking Partners</Text>

            <View style={styles.banksList}>
              {bankOffers.map(b => {
                const isSelected = selectedBank === b.bank;
                return (
                  <TouchableOpacity
                    key={b.bank}
                    onPress={() => setSelectedBank(b.bank)}
                    style={[styles.bankCard, isSelected && styles.bankCardActive]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.bankTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.bankName}>{b.bank}</Text>
                        <View style={styles.bankTag}>
                          <Text style={styles.bankTagText}>{b.badge}</Text>
                        </View>
                      </View>
                      <View style={styles.bankRateCol}>
                        <Text style={styles.bankRateText}>{b.rate}</Text>
                        <Text style={styles.bankRateSub}>Interest Rate</Text>
                      </View>
                    </View>

                    <View style={styles.bankDetailsRow}>
                      <View style={styles.bankDetailItem}>
                        <Text style={styles.bankDetailKey}>Monthly EMI</Text>
                        <Text style={styles.bankDetailVal}>{b.emi}</Text>
                      </View>
                      <View style={styles.bankDetailItem}>
                        <Text style={styles.bankDetailKey}>Max Loan</Text>
                        <Text style={styles.bankDetailVal}>{b.max}</Text>
                      </View>
                      <View style={styles.bankDetailItem}>
                        <Text style={styles.bankDetailKey}>Processing Fee</Text>
                        <Text style={styles.bankDetailVal}>{b.fee}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={() => setStep('documents')}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Select {selectedBank} & Show Documents</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 5: Show Required Documents */}
        {step === 'documents' && (
          <View style={styles.contentPadding}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step 5 of 6: Required Documents</Text>
            </View>

            <View style={styles.docChecklistCard}>
              <Text style={styles.docChecklistTitle}>Document Checklist for {selectedBank}</Text>
              <Text style={styles.docChecklistSub}>Keep soft copies or originals ready for doorstep pickup.</Text>

              <View style={styles.docCategory}>
                <Text style={styles.docCategoryTitle}>1. Identity & Residence Proof</Text>
                <View style={styles.docItem}>
                  <Check size={14} color={colors.secondary} strokeWidth={3} />
                  <Text style={styles.docItemText}>Aadhaar Card & PAN Card</Text>
                </View>
                <View style={styles.docItem}>
                  <Check size={14} color={colors.secondary} strokeWidth={3} />
                  <Text style={styles.docItemText}>Passport or Voter ID or Driving License</Text>
                </View>
              </View>

              <View style={styles.docCategory}>
                <Text style={styles.docCategoryTitle}>2. Income Proof</Text>
                <View style={styles.docItem}>
                  <Check size={14} color={colors.secondary} strokeWidth={3} />
                  <Text style={styles.docItemText}>Last 3 Months Salary Slips</Text>
                </View>
                <View style={styles.docItem}>
                  <Check size={14} color={colors.secondary} strokeWidth={3} />
                  <Text style={styles.docItemText}>Form 16 / ITR Returns for last 2 years</Text>
                </View>
              </View>

              <View style={styles.docCategory}>
                <Text style={styles.docCategoryTitle}>3. Banking & Property</Text>
                <View style={styles.docItem}>
                  <Check size={14} color={colors.secondary} strokeWidth={3} />
                  <Text style={styles.docItemText}>Last 6 Months Salary Account Bank Statement</Text>
                </View>
                <View style={styles.docItem}>
                  <Check size={14} color={colors.secondary} strokeWidth={3} />
                  <Text style={styles.docItemText}>Property Allotment Letter or Agreement of Sale</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (addAdminRequest) {
                  addAdminRequest({
                    category: 'home_loan',
                    title: `Home Loan Application: ${selectedBank}`,
                    userName: 'Rahul Sharma',
                    userPhone: '+91 98765 43210',
                    userEmail: 'rahul@email.com',
                    location: 'Madhapur, Hyderabad',
                    amount: `₹${(parseFloat(amount) / 100000).toFixed(1)} Lakhs`,
                    details: {
                      bank: selectedBank,
                      loanType: selectedLoanType,
                      monthlyIncome: `₹${monthlyIncome}`,
                      interestRate: `${rate}%`,
                      tenure: `${tenureYears} Years`,
                      calculatedEMI: `₹${monthlyEmi.toLocaleString('en-IN')}`,
                    },
                  });
                }
                setStep('contactAdvisor');
              }}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Contact Loan Assistance Provider</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 6: Contact Loan Assistance Provider */}
        {step === 'contactAdvisor' && (
          <View style={styles.contentPadding}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={44} color={colors.secondary} />
            </View>
            <Text style={styles.successTitle}>Loan Assistance Assigned!</Text>
            <Text style={styles.successSub}>
              A dedicated loan specialist from Seedha Financial Services has been assigned to your {selectedBank} application.
            </Text>

            {/* Advisor Card */}
            <View style={styles.advisorCard}>
              <View style={styles.advisorHeader}>
                <View style={styles.advisorAvatar}>
                  <Text style={styles.advisorAvatarText}>PS</Text>
                </View>
                <View style={styles.advisorInfo}>
                  <Text style={styles.advisorName}>Priya Sharma</Text>
                  <Text style={styles.advisorTitle}>Senior Home Loan Advisor</Text>
                  <Text style={styles.advisorExperience}>⭐ 4.9 · 1,400+ loans successfully disbursed</Text>
                </View>
              </View>

              <View style={styles.advisorPerks}>
                <View style={styles.perkRow}>
                  <CheckCircle2 size={14} color={colors.secondary} />
                  <Text style={styles.perkText}>Doorstep document pickup within 24 hours</Text>
                </View>
                <View style={styles.perkRow}>
                  <CheckCircle2 size={14} color={colors.secondary} />
                  <Text style={styles.perkText}>Direct bank negotiation for lowest processing fees</Text>
                </View>
              </View>

              <View style={styles.advisorActionBtns}>
                <TouchableOpacity style={styles.callAdvisorBtn} activeOpacity={0.8}>
                  <Phone size={16} color={colors.primary} />
                  <Text style={styles.callAdvisorBtnText}>Call Priya Sharma</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.whatsappAdvisorBtn} activeOpacity={0.8}>
                  <MessageCircle size={16} color={colors.textWhite} />
                  <Text style={styles.whatsappAdvisorBtnText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setTab('home')}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Return to Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.tertiaryBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  loanTypeList: {
    gap: 10,
    marginBottom: 20,
  },
  loanTypeCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  loanTypeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  loanTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  loanTypeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  rateBadge: {
    backgroundColor: colors.secondaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  loanTypeSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stepBadge: {
    backgroundColor: colors.secondaryBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  emiHighlightCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  emiHighlightLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  emiHighlightValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textWhite,
    marginVertical: 4,
  },
  emiMetaRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 10,
    marginTop: 6,
  },
  emiMetaItem: {
    alignItems: 'center',
  },
  emiMetaKey: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  emiMetaVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textWhite,
    marginTop: 2,
  },
  formGroup: {
    marginBottom: 14,
  },
  calcField: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  quickChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quickChipActive: {
    backgroundColor: colors.tertiaryBg,
    borderColor: colors.primary,
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quickChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tenureChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tenureChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tenureChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tenureChipTextActive: {
    color: colors.textWhite,
    fontWeight: '700',
  },
  eligibilityResultCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: 16,
  },
  eligibilityCongrats: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
  },
  eligibilitySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  eligibilityAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.secondary,
    marginTop: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  toggleBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  banksList: {
    gap: 10,
    marginBottom: 20,
  },
  bankCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  bankCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  bankTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  bankTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3,
  },
  bankTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
  },
  bankRateCol: {
    alignItems: 'flex-end',
  },
  bankRateText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  bankRateSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  bankDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  bankDetailItem: {
    alignItems: 'center',
  },
  bankDetailKey: {
    fontSize: 10,
    color: colors.textMuted,
  },
  bankDetailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  docChecklistCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  docChecklistTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  docChecklistSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  docCategory: {
    marginBottom: 12,
  },
  docCategoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  docItemText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  advisorCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  advisorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  advisorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advisorAvatarText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  advisorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  advisorName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  advisorTitle: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
  advisorExperience: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  advisorPerks: {
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 14,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  advisorActionBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  callAdvisorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 6,
  },
  callAdvisorBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  whatsappAdvisorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    gap: 6,
  },
  whatsappAdvisorBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textWhite,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
});
