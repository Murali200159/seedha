import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, CheckCircle2, Download, Share2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

type Step = 'landing' | 'details' | 'terms' | 'preview' | 'payment' | 'done';
const steps: Step[] = ['details', 'terms', 'preview', 'payment', 'done'];

export default function RentalAgreementScreen() {
  const { pop } = useApp();
  const [step, setStep] = useState<Step>('landing');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tenantName: '', tenantPhone: '', ownerName: '', ownerPhone: '',
    propertyAddress: '', rentPerMonth: '', securityDeposit: '', agreementDuration: '11',
    noticePeriod: '1',
  });

  const advance = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) {
      if (step === 'payment') {
        setLoading(true);
        setTimeout(() => { setLoading(false); setStep('done'); }, 1200);
      } else {
        setStep(steps[idx + 1]);
      }
    }
  };

  if (step === 'done') {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successBadgeCircle}>
          <CheckCircle2 size={40} color={colors.secondary} />
        </View>
        <Text style={styles.successTitle}>Agreement Ready!</Text>
        <Text style={styles.successSub}>Your rental agreement has been created and sent to both parties.</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.actionBtnOutline} activeOpacity={0.8}>
            <Download size={16} color={colors.primary} />
            <Text style={styles.actionBtnOutlineText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnSolid} activeOpacity={0.8}>
            <Share2 size={16} color={colors.textWhite} />
            <Text style={styles.actionBtnSolidText}>Share</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={pop} style={{ marginTop: 16 }}>
          <Text style={styles.backHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={step === 'landing' ? pop : () => { const i = steps.indexOf(step); setStep(i > 0 ? steps[i - 1] : 'landing'); }}
          style={styles.backCircle}
          activeOpacity={0.8}
        >
          <ChevronLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rental Agreement</Text>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {step === 'landing' && (
          <View style={styles.sectionPadding}>
            <View style={styles.landingBanner}>
              <Text style={styles.landingTitle}>Digital Rent Agreement</Text>
              <Text style={styles.landingSub}>₹499 · Legally Valid · Instant</Text>
            </View>

            <View style={styles.featureGrid}>
              {[
                { v: '₹499', l: 'Flat Fee' },
                { v: '10min', l: 'To Create' },
                { v: '100%', l: 'Legal' },
              ].map(({ v, l }) => (
                <View key={l} style={styles.featureCard}>
                  <Text style={styles.featureVal}>{v}</Text>
                  <Text style={styles.featureSub}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 'details' && (
          <View style={styles.sectionPadding}>
            <Text style={styles.stepTitle}>Party Details</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Tenant Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Arjun Reddy"
                placeholderTextColor={colors.textMuted}
                value={form.tenantName}
                onChangeText={text => setForm(f => ({ ...f, tenantName: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Owner Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Venkata Rao"
                placeholderTextColor={colors.textMuted}
                value={form.ownerName}
                onChangeText={text => setForm(f => ({ ...f, ownerName: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Property Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Kondapur, Hyderabad"
                placeholderTextColor={colors.textMuted}
                value={form.propertyAddress}
                onChangeText={text => setForm(f => ({ ...f, propertyAddress: text }))}
              />
            </View>
          </View>
        )}

        {step === 'terms' && (
          <View style={styles.sectionPadding}>
            <Text style={styles.stepTitle}>Rental Terms</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Monthly Rent (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="15,000"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={form.rentPerMonth}
                onChangeText={text => setForm(f => ({ ...f, rentPerMonth: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Security Deposit (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="45,000"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={form.securityDeposit}
                onChangeText={text => setForm(f => ({ ...f, securityDeposit: text }))}
              />
            </View>
          </View>
        )}

        {step === 'payment' && (
          <View style={styles.sectionPadding}>
            <Text style={styles.stepTitle}>Payment</Text>
            <View style={styles.paymentBox}>
              <Text style={styles.paymentTitle}>Digital Agreement Fee</Text>
              <Text style={styles.paymentPrice}>₹589 (incl. GST)</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => step === 'landing' ? setStep('details') : advance()}
          disabled={loading}
          style={styles.mainButton}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={styles.mainButtonText}>{step === 'landing' ? 'Create Agreement' : step === 'payment' ? 'Pay ₹589' : 'Continue'}</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 10,
  },
  scrollArea: {
    flex: 1,
  },
  sectionPadding: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  landingBanner: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  landingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textWhite,
  },
  landingSub: {
    fontSize: 12,
    color: colors.tertiary,
    marginTop: 4,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.tertiary,
    elevation: 1,
  },
  featureVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  featureSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  paymentBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
  },
  paymentTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 6,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  mainButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textWhite,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  successBadgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  actionBtnOutline: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  actionBtnSolid: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSolidText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textWhite,
    marginLeft: 6,
  },
  backHomeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
