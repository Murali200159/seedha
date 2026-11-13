import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  CheckCircle2,
  Download,
  Share2,
  FileSignature,
  Building,
  User,
  ShieldCheck,
  Check,
  ArrowRight,
  Clock,
  Printer,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';

type Step = 'role' | 'enterDetails' | 'preview' | 'pay' | 'order' | 'completed';

export default function RentalAgreementScreen() {
  const { pop, setTab, addAdminRequest } = useApp();
  const [step, setStep] = useState<Step>('role');
  const [userRole, setUserRole] = useState<'owner' | 'tenant'>('tenant');

  // Form Details
  const [ownerName, setOwnerName] = useState('Rajeshwar Rao');
  const [ownerPhone, setOwnerPhone] = useState('+91 98490 12345');
  const [tenantName, setTenantName] = useState('Rahul Sharma');
  const [tenantPhone, setTenantPhone] = useState('+91 98765 43210');
  const [propertyAddress, setPropertyAddress] = useState('Flat 402, Rainbow Vistas, HITEC City, Hyderabad');
  const [rentAmount, setRentAmount] = useState('32000');
  const [depositAmount, setDepositAmount] = useState('64000');
  const [durationMonths, setDurationMonths] = useState('11');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleStartAgreement = () => {
    setStep('enterDetails');
  };

  const handleProceedToPreview = () => {
    if (!ownerName.trim() || !tenantName.trim() || !propertyAddress.trim()) {
      alert('Please fill in Owner, Tenant, and Property Address details.');
      return;
    }
    setStep('preview');
  };

  const handleProceedToPayment = () => {
    setStep('pay');
  };

  const handlePay = () => {
    if (addAdminRequest) {
      addAdminRequest({
        category: 'rental_agreement',
        title: `Rental Agreement: ${tenantName} & ${ownerName}`,
        userName: userRole === 'tenant' ? tenantName : ownerName,
        userPhone: userRole === 'tenant' ? tenantPhone : ownerPhone,
        userEmail: 'rahul@email.com',
        location: propertyAddress,
        amount: `₹${parseInt(rentAmount || '32000').toLocaleString('en-IN')}/mo`,
        details: {
          role: userRole,
          tenantName,
          tenantPhone,
          ownerName,
          ownerPhone,
          propertyAddress,
          rentAmount: `₹${rentAmount || '32000'}`,
          depositAmount: `₹${depositAmount || '64000'}`,
          durationMonths: `${durationMonths} Months`,
          stampDutyPaid: '₹599 Paid',
        },
      });
    }

    setStep('order');
    setTimeout(() => {
      setStep('completed');
    }, 2000);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      alert('Rental Agreement PDF downloaded successfully with valid e-Stamp seal!');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'role') pop();
            else if (step === 'enterDetails') setStep('role');
            else if (step === 'preview') setStep('enterDetails');
            else if (step === 'pay') setStep('preview');
            else if (step === 'order') setStep('pay');
            else if (step === 'completed') setTab('home');
          }}
          style={styles.backCircle}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Rental Agreements</Text>
          <Text style={styles.headerSub}>
            {step === 'role'
              ? 'Select Owner / Tenant'
              : step === 'enterDetails'
              ? 'Enter Agreement Details'
              : step === 'preview'
              ? 'Preview Legal Agreement'
              : step === 'pay'
              ? 'Pay Stamp & Drafting Fee'
              : step === 'order'
              ? 'Placing Order...'
              : 'Agreement Received'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Step 1: Owner / Tenant Role Selection & Click Rental Agreements */}
        {step === 'role' && (
          <View style={styles.contentPadding}>
            <View style={styles.heroCard}>
              <View style={styles.heroBadge}>
                <FileSignature size={16} color={colors.secondary} />
                <Text style={styles.heroBadgeText}>GOVERNMENT APPROVED E-STAMP</Text>
              </View>
              <Text style={styles.heroTitle}>Create Legally Binding Rental Agreement</Text>
              <Text style={styles.heroSub}>
                100% legal, non-judicial e-stamp paper delivered digitally with Aadhaar e-Sign support.
              </Text>
            </View>

            <Text style={styles.sectionHeading}>Are you an Owner or Tenant?</Text>

            <View style={styles.rolesRow}>
              <TouchableOpacity
                onPress={() => setUserRole('tenant')}
                style={[styles.roleOption, userRole === 'tenant' && styles.roleOptionActive]}
                activeOpacity={0.85}
              >
                <View style={[styles.roleIconBox, { backgroundColor: colors.primaryBg }]}>
                  <User size={22} color={colors.primary} />
                </View>
                <Text style={styles.roleTitle}>I am the Tenant</Text>
                <Text style={styles.roleSub}>Draft agreement to submit to landlord & claim HRA</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setUserRole('owner')}
                style={[styles.roleOption, userRole === 'owner' && styles.roleOptionActive]}
                activeOpacity={0.85}
              >
                <View style={[styles.roleIconBox, { backgroundColor: colors.secondaryBg }]}>
                  <Building size={22} color={colors.secondary} />
                </View>
                <Text style={styles.roleTitle}>I am the Landlord</Text>
                <Text style={styles.roleSub}>Draft agreement for new or renewing tenant</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.perksBox}>
              <View style={styles.perkItem}>
                <CheckCircle2 size={16} color={colors.secondary} />
                <Text style={styles.perkText}>Official ₹100 e-Stamp certificate included</Text>
              </View>
              <View style={styles.perkItem}>
                <CheckCircle2 size={16} color={colors.secondary} />
                <Text style={styles.perkText}>Legally vetted clauses protecting deposit & tenure</Text>
              </View>
              <View style={styles.perkItem}>
                <CheckCircle2 size={16} color={colors.secondary} />
                <Text style={styles.perkText}>Both parties e-sign from mobile via Aadhaar OTP</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleStartAgreement}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Click Rental Agreements → Start Details</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Enter Details */}
        {step === 'enterDetails' && (
          <View style={styles.contentPadding}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step 2 of 5: Enter Parties & Property Details</Text>
            </View>

            <Text style={styles.subHeading}>Landlord / Owner Details</Text>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Owner Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={ownerName}
                onChangeText={setOwnerName}
                placeholder="e.g. Rajeshwar Rao"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Owner Phone *</Text>
              <TextInput
                style={styles.textInput}
                value={ownerPhone}
                onChangeText={setOwnerPhone}
                placeholder="+91 98490 12345"
              />
            </View>

            <Text style={styles.subHeading}>Tenant Details</Text>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Tenant Full Name *</Text>
              <TextInput
                style={styles.textInput}
                value={tenantName}
                onChangeText={setTenantName}
                placeholder="e.g. Rahul Sharma"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Tenant Phone *</Text>
              <TextInput
                style={styles.textInput}
                value={tenantPhone}
                onChangeText={setTenantPhone}
                placeholder="+91 98765 43210"
              />
            </View>

            <Text style={styles.subHeading}>Property & Financial Terms</Text>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Rented Property Address *</Text>
              <TextInput
                style={styles.textInput}
                value={propertyAddress}
                onChangeText={setPropertyAddress}
                placeholder="Flat / Unit No., Building, Area, City"
              />
            </View>

            <View style={styles.rowTwo}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Monthly Rent (₹)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={rentAmount}
                  onChangeText={setRentAmount}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Security Deposit (₹)</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={depositAmount}
                  onChangeText={setDepositAmount}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Agreement Duration</Text>
              <View style={styles.chipRow}>
                {['11', '22', '33'].map(m => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setDurationMonths(m)}
                    style={[styles.tenureChip, durationMonths === m && styles.tenureChipActive]}
                  >
                    <Text style={[styles.tenureChipText, durationMonths === m && styles.tenureChipTextActive]}>
                      {m} Months
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleProceedToPreview}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Submit and Preview Agreement</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Submit and Preview Agreement */}
        {step === 'preview' && (
          <View style={styles.contentPadding}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step 3 of 5: Preview Legal Agreement</Text>
            </View>

            {/* Simulated Government e-Stamp Paper */}
            <View style={styles.stampPaper}>
              <View style={styles.stampHeader}>
                <Text style={styles.stampGovText}>GOVERNMENT OF INDIA · NON-JUDICIAL</Text>
                <Text style={styles.stampCertNo}>Certificate No: IN-DL84920492819241K</Text>
                <Text style={styles.stampValue}>E-STAMP VALUE: ₹100.00</Text>
              </View>

              <Text style={styles.legalTitle}>RESIDENTIAL LEASE AGREEMENT</Text>
              <Text style={styles.legalDate}>
                Made on this {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>

              <View style={styles.clauseBox}>
                <Text style={styles.clauseTitle}>BETWEEN:</Text>
                <Text style={styles.clauseBody}>
                  <Text style={{ fontWeight: '700' }}>LESSOR (Landlord):</Text> {ownerName}, Phone: {ownerPhone}
                </Text>
                <Text style={[styles.clauseBody, { marginTop: 6 }]}>
                  <Text style={{ fontWeight: '700' }}>LESSEE (Tenant):</Text> {tenantName}, Phone: {tenantPhone}
                </Text>
              </View>

              <View style={styles.clauseBox}>
                <Text style={styles.clauseTitle}>DEMISED PREMISES:</Text>
                <Text style={styles.clauseBody}>{propertyAddress}</Text>
              </View>

              <View style={styles.clauseBox}>
                <Text style={styles.clauseTitle}>TERMS & CONDITIONS:</Text>
                <Text style={styles.clauseItem}>
                  1. <Text style={{ fontWeight: '600' }}>Rent:</Text> The Tenant shall pay a monthly rent of ₹{parseInt(rentAmount).toLocaleString('en-IN')} on or before the 5th of each month.
                </Text>
                <Text style={styles.clauseItem}>
                  2. <Text style={{ fontWeight: '600' }}>Security Deposit:</Text> An interest-free refundable deposit of ₹{parseInt(depositAmount).toLocaleString('en-IN')} has been remitted to Landlord.
                </Text>
                <Text style={styles.clauseItem}>
                  3. <Text style={{ fontWeight: '600' }}>Duration & Notice:</Text> This agreement is valid for {durationMonths} months, subject to 1 month written notice by either party.
                </Text>
              </View>

              <View style={styles.signatureRow}>
                <View style={styles.sigBox}>
                  <Text style={styles.sigRole}>Lessor Signature</Text>
                  <Text style={styles.sigStatus}>[Aadhaar e-Sign Pending]</Text>
                </View>
                <View style={styles.sigBox}>
                  <Text style={styles.sigRole}>Lessee Signature</Text>
                  <Text style={styles.sigStatus}>[Aadhaar e-Sign Pending]</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleProceedToPayment}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Pay Money (₹499) & Order Agreement</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Pay Money */}
        {step === 'pay' && (
          <View style={styles.contentPadding}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>Step 4 of 5: Payment (Stamp Paper & Legal Drafting)</Text>
            </View>

            <View style={styles.invoiceCard}>
              <Text style={styles.invoiceTitle}>Payment Breakdown</Text>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Official Government e-Stamp Duty (₹100)</Text>
                <Text style={styles.invoiceVal}>₹100.00</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Legal Drafting & Lawyer Vetting</Text>
                <Text style={styles.invoiceVal}>₹300.00</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceLabel}>Digital Aadhaar e-Sign & Delivery</Text>
                <Text style={styles.invoiceVal}>₹99.00</Text>
              </View>
              <View style={[styles.invoiceRow, styles.invoiceTotalRow]}>
                <Text style={styles.invoiceTotalLabel}>Total Amount Due</Text>
                <Text style={styles.invoiceTotalVal}>₹499.00</Text>
              </View>
            </View>

            <Text style={styles.subHeading}>Choose Payment Option</Text>

            <TouchableOpacity
              onPress={() => setPaymentMethod('upi')}
              style={[styles.payCard, paymentMethod === 'upi' && styles.payCardActive]}
              activeOpacity={0.8}
            >
              <View style={styles.payRadio}>
                {paymentMethod === 'upi' && <View style={styles.payRadioDot} />}
              </View>
              <Text style={styles.payTitle}>UPI (Google Pay, PhonePe, Paytm)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod('card')}
              style={[styles.payCard, paymentMethod === 'card' && styles.payCardActive]}
              activeOpacity={0.8}
            >
              <View style={styles.payRadio}>
                {paymentMethod === 'card' && <View style={styles.payRadioDot} />}
              </View>
              <Text style={styles.payTitle}>Credit / Debit Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod('netbanking')}
              style={[styles.payCard, paymentMethod === 'netbanking' && styles.payCardActive]}
              activeOpacity={0.8}
            >
              <View style={styles.payRadio}>
                {paymentMethod === 'netbanking' && <View style={styles.payRadioDot} />}
              </View>
              <Text style={styles.payTitle}>Net Banking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePay}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Pay ₹499 & Order Agreement</Text>
              <ArrowRight size={18} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 5: Order Agreements Processing */}
        {step === 'order' && (
          <View style={styles.orderWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.orderTitle}>Order Agreements in Progress...</Text>
            <Text style={styles.orderSub}>
              Affixing government non-judicial stamp, generating QR verification stamp, and preparing digital e-sign links.
            </Text>
          </View>
        )}

        {/* Step 6: Agreement Received / Completed */}
        {step === 'completed' && (
          <View style={styles.contentPadding}>
            <View style={styles.successIconCircle}>
              <CheckCircle2 size={44} color={colors.secondary} />
            </View>
            <Text style={styles.successTitle}>Agreement Received & Completed!</Text>
            <Text style={styles.successSub}>
              Order <Text style={{ fontWeight: '700', color: colors.primary }}>#RA-2026-90412</Text> is active. The legally sealed agreement is ready to download and sign.
            </Text>

            <View style={styles.statusBox}>
              <View style={styles.statusRow}>
                <CheckCircle2 size={16} color={colors.secondary} />
                <Text style={styles.statusText}>e-Stamp Paper Generated & Sealed</Text>
              </View>
              <View style={styles.statusRow}>
                <CheckCircle2 size={16} color={colors.secondary} />
                <Text style={styles.statusText}>Digital e-Sign link dispatched to {ownerPhone} and {tenantPhone}</Text>
              </View>
              <View style={styles.statusRow}>
                <CheckCircle2 size={16} color={colors.secondary} />
                <Text style={styles.statusText}>Valid across India for HRA & address proof</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleDownload}
              style={styles.downloadBtn}
              activeOpacity={0.85}
            >
              <Download size={18} color={colors.textWhite} />
              <Text style={styles.downloadBtnText}>
                {downloadSuccess ? 'Downloaded!' : 'Download Agreement (PDF)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => alert('Agreement shared via WhatsApp & Email!')}
              style={styles.shareBtn}
              activeOpacity={0.8}
            >
              <Share2 size={16} color={colors.primary} />
              <Text style={styles.shareBtnText}>Share Agreement Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTab('home')}
              style={styles.homeReturnBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.homeReturnBtnText}>Back to Home</Text>
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
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
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
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
    marginBottom: 10,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  roleOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  roleOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  roleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  roleSub: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  perksBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 20,
    gap: 10,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkText: {
    fontSize: 12,
    color: colors.textPrimary,
  },
  stepBadge: {
    backgroundColor: colors.secondaryBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  formGroup: {
    marginBottom: 14,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 10,
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
    fontSize: 14,
    color: colors.primary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
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
  stampPaper: {
    backgroundColor: '#FAF7EE',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#C7B299',
    marginBottom: 20,
  },
  stampHeader: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#C7B299',
    paddingBottom: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  stampGovText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8A6D3B',
    letterSpacing: 1,
  },
  stampCertNo: {
    fontSize: 10,
    color: '#555',
    marginTop: 2,
  },
  stampValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8A6D3B',
    marginTop: 4,
  },
  legalTitle: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  legalDate: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  clauseBox: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  clauseTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  clauseBody: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  clauseItem: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 16,
    marginBottom: 4,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#C7B299',
    paddingTop: 10,
  },
  sigBox: {
    alignItems: 'center',
  },
  sigRole: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  sigStatus: {
    fontSize: 9,
    color: colors.accent,
    marginTop: 2,
  },
  invoiceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  invoiceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 8,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  invoiceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  invoiceVal: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  invoiceTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 8,
    paddingTop: 8,
  },
  invoiceTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  invoiceTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  payCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
  },
  payCardActive: {
    borderColor: colors.primary,
  },
  payRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  payRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  payTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  orderWrap: {
    paddingTop: 90,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 18,
  },
  orderSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
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
  statusBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    color: colors.textPrimary,
    flex: 1,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 10,
  },
  downloadBtnText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    marginBottom: 10,
  },
  shareBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  homeReturnBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  homeReturnBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
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
