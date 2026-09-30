import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, CheckCircle2, Download, Share2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

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
          <CheckCircle2 size={40} color="#16A34A" />
        </View>
        <Text style={styles.successTitle}>Agreement Ready!</Text>
        <Text style={styles.successSub}>Your rental agreement has been created and sent to both parties.</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.actionBtnOutline} activeOpacity={0.8}>
            <Download size={16} color="#2260FF" />
            <Text style={styles.actionBtnOutlineText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnSolid} activeOpacity={0.8}>
            <Share2 size={16} color="white" />
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
          <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
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
                placeholderTextColor="#9CA3AF"
                value={form.tenantName}
                onChangeText={text => setForm(f => ({ ...f, tenantName: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Owner Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Venkata Rao"
                placeholderTextColor="#9CA3AF"
                value={form.ownerName}
                onChangeText={text => setForm(f => ({ ...f, ownerName: text }))}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.inputLabel}>Property Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Kondapur, Hyderabad"
                placeholderTextColor="#9CA3AF"
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
                placeholderTextColor="#9CA3AF"
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
                placeholderTextColor="#9CA3AF"
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
            <ActivityIndicator color="white" />
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
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
    backgroundColor: '#2260FF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  landingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  landingSub: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 4,
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
  },
  featureVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2260FF',
  },
  featureSub: {
    fontSize: 10,
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
  paymentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
  },
  paymentTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2260FF',
    marginTop: 6,
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
    borderColor: '#2260FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2260FF',
    marginLeft: 6,
  },
  actionBtnSolid: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2260FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSolidText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  backHomeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
