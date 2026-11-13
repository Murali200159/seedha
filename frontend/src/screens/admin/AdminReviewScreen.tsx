import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  CheckCircle2,
  Phone,
  MessageCircle,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  XCircle,
  FileText,
  Send,
  UploadCloud,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import type { AdminItem } from '../../types';
import colors from '../../theme/colors';

export default function AdminReviewScreen() {
  const { currentScreen, pop, updateAdminRequest } = useApp();
  const initialItem = currentScreen.params?.item as AdminItem;
  const [item, setItem] = useState<AdminItem>(initialItem);

  // Notes / Inputs
  const [adminNotes, setAdminNotes] = useState(item?.notes || '');
  const [rejectReason, setRejectReason] = useState(
    'Location is outside our current operational and property inspection zone in Telangana.'
  );
  const [actionDoneMsg, setActionDoneMsg] = useState('');

  if (!item) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
            <ChevronLeft size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Request</Text>
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ color: colors.textSecondary }}>No request selected.</Text>
        </View>
      </View>
    );
  }

  const handleUpdateStage = (nextStage: number, status: string, msg: string) => {
    const updated = { ...item, stage: nextStage, status, notes: adminNotes };
    setItem(updated);
    updateAdminRequest(item.id, updated);
    setActionDoneMsg(msg);
  };

  const handleRejectLocation = () => {
    const updated = {
      ...item,
      status: 'rejected_unserviceable',
      rejectionReason: rejectReason,
      notes: adminNotes,
    };
    setItem(updated);
    updateAdminRequest(item.id, updated);
    setActionDoneMsg('Reject message sent to owner successfully.');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pop} style={styles.backCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color={colors.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Admin Review & Action</Text>
          <Text style={styles.headerSub}>ID: {item.id} · {item.category.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Item Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category.replace('_', ' ').toUpperCase()}</Text>
              </View>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>

            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubtitle}>{item.subtitle}</Text>

            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Submitted By:</Text>
                <Text style={styles.metaVal}>{item.submittedBy}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Contact Phone:</Text>
                <Text style={styles.metaVal}>{item.phone}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Location:</Text>
                <Text style={styles.metaVal}>{item.location}</Text>
              </View>
            </View>

            {/* Dynamic Specific Details */}
            <View style={styles.detailsGrid}>
              {Object.entries(item.details || {}).map(([key, val]) => (
                <View key={key} style={styles.detailGridCell}>
                  <Text style={styles.detailGridKey}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</Text>
                  <Text style={styles.detailGridVal}>{String(val)}</Text>
                </View>
              ))}
            </View>

            {/* Quick Contact Bar for Admin */}
            <View style={styles.quickContactRow}>
              <TouchableOpacity
                onPress={() => alert(`Calling ${item.phone}...`)}
                style={styles.contactBtnOutline}
                activeOpacity={0.8}
              >
                <Phone size={14} color={colors.primary} />
                <Text style={styles.contactBtnOutlineText}>Call Applicant</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => alert(`Opening WhatsApp chat with ${item.phone}...`)}
                style={styles.contactBtnSolid}
                activeOpacity={0.8}
              >
                <MessageCircle size={14} color={colors.textWhite} />
                <Text style={styles.contactBtnSolidText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Success Alert */}
          {actionDoneMsg ? (
            <View style={styles.actionSuccessNotice}>
              <CheckCircle2 size={16} color={colors.secondary} />
              <Text style={styles.actionSuccessNoticeText}>{actionDoneMsg}</Text>
            </View>
          ) : null}

          {/* ══════════════════════════════════════════════════════
              BRANCH 1, 2, 3: Flat/Building, Rent, Commercial Space
              Sequence: Admin Check Details -> Team Contact Owner / Field Work -> After Verify -> Publish the Post
             ══════════════════════════════════════════════════════ */}
          {(item.category === 'flat_building' || item.category === 'rent' || item.category === 'commercial') && (
            <View style={styles.workflowSection}>
              <Text style={styles.workflowHeading}>Review & Publishing Sequence</Text>

              {/* Step 1: Admin Check Details */}
              <View style={styles.stepCard}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 0 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>1</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>
                      {item.category === 'flat_building'
                        ? 'Admin Check Flat / Building Details'
                        : item.category === 'rent'
                        ? 'Admin Check Rent Details'
                        : 'Admin Check Commercial Space Details'}
                    </Text>
                    <Text style={styles.stepSub}>Verify photos, property dimensions, pricing and ownership legitimacy.</Text>
                  </View>
                </View>
              </View>

              {/* Step 2: Team can contact owner or do field work also */}
              <View style={[styles.stepCard, item.stage >= 1 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 1 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>2</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Team Can Contact Owner or Do Field Work Also</Text>
                    <Text style={styles.stepSub}>Field agent visit scheduled or phone consultation conducted with owner.</Text>
                  </View>
                </View>
                {item.stage === 0 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(1, 'contacted_or_fieldwork', 'Owner contacted and field inspection logged.')}
                    style={styles.actionBtn}
                    activeOpacity={0.85}
                  >
                    <Phone size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Confirm Owner Contacted / Field Work Done</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Step 3: After Verify */}
              <View style={[styles.stepCard, item.stage >= 2 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 2 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>3</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>After Verify</Text>
                    <Text style={styles.stepSub}>All physical and document checks cleared by operations team.</Text>
                  </View>
                </View>
                {item.stage === 1 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(2, 'verified', 'Listing officially marked Verified.')}
                    style={styles.actionBtn}
                    activeOpacity={0.85}
                  >
                    <ShieldCheck size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Mark Verified & Clear for Publishing</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Step 4: Publish the Post */}
              <View style={[styles.stepCard, item.stage >= 3 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 3 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>4</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Publish the Post</Text>
                    <Text style={styles.stepSub}>Post goes live on the app feed for all buyers and tenants.</Text>
                  </View>
                </View>
                {item.stage === 2 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(3, 'published', 'Property post successfully published live to app!')}
                    style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
                    activeOpacity={0.85}
                  >
                    <UploadCloud size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Publish the Post to App</Text>
                  </TouchableOpacity>
                )}
                {item.stage >= 3 && (
                  <View style={styles.doneBanner}>
                    <CheckCircle2 size={16} color={colors.secondary} />
                    <Text style={styles.doneBannerText}>Listing is Published & Live</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ══════════════════════════════════════════════════════
              BRANCH 4: Property Management Details
              Sequence: Admin check details of PM -> Admin checks location ->
                        Decision: if location matches -> team can contact owner
                                  else then send reject message
             ══════════════════════════════════════════════════════ */}
          {item.category === 'property_management' && (
            <View style={styles.workflowSection}>
              <Text style={styles.workflowHeading}>Property Management Sequence</Text>

              {/* Step 1: Admin Check Details */}
              <View style={styles.stepCard}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>1</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Admin Check Details of Property Management</Text>
                    <Text style={styles.stepSub}>Flat No: {item.details.flatNo}, Society: {item.details.society}, Expected Rent: {item.details.expectedRent}</Text>
                  </View>
                </View>
              </View>

              {/* Step 2: Admin Checks Location & Decision */}
              <View style={[styles.stepCard, styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 1 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>2</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Admin Checks Location</Text>
                    <Text style={styles.stepSub}>Property Location: <Text style={{ fontWeight: '700' }}>{item.location}</Text></Text>
                  </View>
                </View>

                {item.status === 'pending_review' && (
                  <View style={styles.decisionWrap}>
                    <Text style={styles.decisionPrompt}>Location Match Decision:</Text>

                    {/* Decision Branch A: If location matches */}
                    <TouchableOpacity
                      onPress={() => handleUpdateStage(1, 'location_matched', 'Location confirmed serviceable in active zone.')}
                      style={styles.decisionMatchBtn}
                      activeOpacity={0.85}
                    >
                      <CheckCircle2 size={16} color={colors.textWhite} />
                      <Text style={styles.decisionMatchBtnText}>Location Matches Serviceable Area</Text>
                    </TouchableOpacity>

                    {/* Decision Branch B: Else then send reject message */}
                    <TouchableOpacity
                      onPress={handleRejectLocation}
                      style={styles.decisionRejectBtn}
                      activeOpacity={0.85}
                    >
                      <XCircle size={16} color={colors.danger} />
                      <Text style={styles.decisionRejectBtnText}>Else → Send Reject Message to Owner</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === 'rejected_unserviceable' && (
                  <View style={styles.rejectedBanner}>
                    <XCircle size={16} color={colors.danger} />
                    <Text style={styles.rejectedBannerText}>Reject Message Sent to Owner: Outside Serviceable Area</Text>
                  </View>
                )}
              </View>

              {/* Step 3: If Location Matches -> Team Can Contact Owner */}
              {item.status !== 'rejected_unserviceable' && (
                <View style={[styles.stepCard, item.stage >= 2 && styles.stepCardActive]}>
                  <View style={styles.stepCardHeader}>
                    <View style={[styles.stepNumCircle, item.stage >= 2 && styles.stepNumCircleDone]}>
                      <Text style={styles.stepNumText}>3</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.stepTitle}>Team Can Contact Owner</Text>
                      <Text style={styles.stepSub}>Call owner to confirm keys handover, inspection date & management contract.</Text>
                    </View>
                  </View>

                  {item.stage === 1 && (
                    <TouchableOpacity
                      onPress={() => handleUpdateStage(2, 'owner_contacted', 'Team contacted owner. Management contract initiated.')}
                      style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
                      activeOpacity={0.85}
                    >
                      <Phone size={14} color={colors.textWhite} />
                      <Text style={styles.actionBtnText}>Team Contact Owner Now</Text>
                    </TouchableOpacity>
                  )}

                  {item.stage >= 2 && (
                    <View style={styles.doneBanner}>
                      <CheckCircle2 size={16} color={colors.secondary} />
                      <Text style={styles.doneBannerText}>Owner Contacted · Manager Assigned</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* ══════════════════════════════════════════════════════
              BRANCH 5: Home Loan Details
              Sequence: Admin Check Details of Home Loan -> Team Directly Contact User
             ══════════════════════════════════════════════════════ */}
          {item.category === 'home_loan' && (
            <View style={styles.workflowSection}>
              <Text style={styles.workflowHeading}>Home Loan Processing Sequence</Text>

              {/* Step 1: Admin Check Details */}
              <View style={styles.stepCard}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>1</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Admin Check Details of Home Loan</Text>
                    <Text style={styles.stepSub}>
                      Requested: {item.details.loanAmount} · Bank: {item.details.bankSelected} · Salary: {item.details.monthlySalary}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Step 2: Team Directly Contact User */}
              <View style={[styles.stepCard, item.stage >= 1 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 1 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>2</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Team Directly Contact User</Text>
                    <Text style={styles.stepSub}>Connect loan specialist with user to collect documents & negotiate bank rate.</Text>
                  </View>
                </View>

                {item.stage === 0 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(1, 'user_contacted', 'Loan team directly contacted applicant.')}
                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                    activeOpacity={0.85}
                  >
                    <Phone size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Team Directly Contact User</Text>
                  </TouchableOpacity>
                )}

                {item.stage >= 1 && (
                  <View style={styles.doneBanner}>
                    <CheckCircle2 size={16} color={colors.secondary} />
                    <Text style={styles.doneBannerText}>User Contacted Directly by Loan Specialist</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ══════════════════════════════════════════════════════
              BRANCH 6: Rental Agreement Details
              Sequence: Admin Check Details of Rental Agreements -> Prepare Documents -> Send to User
             ══════════════════════════════════════════════════════ */}
          {item.category === 'rental_agreement' && (
            <View style={styles.workflowSection}>
              <Text style={styles.workflowHeading}>Rental Agreement Sequence</Text>

              {/* Step 1: Admin Check Details */}
              <View style={styles.stepCard}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>1</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Admin Check Details of Rental Agreements</Text>
                    <Text style={styles.stepSub}>Parties: {item.submittedBy} · Rent: {item.details.monthlyRent}</Text>
                  </View>
                </View>
              </View>

              {/* Step 2: Prepare Documents */}
              <View style={[styles.stepCard, item.stage >= 1 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 1 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>2</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Prepare Documents</Text>
                    <Text style={styles.stepSub}>Affix ₹100 non-judicial e-Stamp seal, stamp duty ID, and notary clauses.</Text>
                  </View>
                </View>

                {item.stage === 0 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(1, 'documents_prepared', 'e-Stamp agreement documents prepared.')}
                    style={styles.actionBtn}
                    activeOpacity={0.85}
                  >
                    <FileText size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Prepare Documents & Affix e-Stamp</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Step 3: Send to User */}
              <View style={[styles.stepCard, item.stage >= 2 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 2 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>3</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Send to User</Text>
                    <Text style={styles.stepSub}>Transmit executed agreement PDF and digital signature links to tenant and owner.</Text>
                  </View>
                </View>

                {item.stage === 1 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(2, 'sent_to_user', 'Agreement transmitted to user and owner.')}
                    style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
                    activeOpacity={0.85}
                  >
                    <Send size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Send to User & Owner Digitally</Text>
                  </TouchableOpacity>
                )}

                {item.stage >= 2 && (
                  <View style={styles.doneBanner}>
                    <CheckCircle2 size={16} color={colors.secondary} />
                    <Text style={styles.doneBannerText}>Documents Sent to User & Landlord</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ══════════════════════════════════════════════════════
              BRANCH 7: Owner Background Details
              Sequence: Admin Check Details of Flat and Owner -> Team Contact Owner or Field Work -> Collect Details -> Admin Send Details to User Through Digital
             ══════════════════════════════════════════════════════ */}
          {item.category === 'owner_background' && (
            <View style={styles.workflowSection}>
              <Text style={styles.workflowHeading}>Owner Background Verification Sequence</Text>

              {/* Step 1: Admin Check Details */}
              <View style={styles.stepCard}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>1</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Admin Check Details of Flat and Owner</Text>
                    <Text style={styles.stepSub}>Owner: {item.details.ownerName} · Flat: {item.details.flatToVerify}</Text>
                  </View>
                </View>
              </View>

              {/* Step 2: Team can contact owner or do field work also */}
              <View style={[styles.stepCard, item.stage >= 1 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 1 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>2</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Team Can Contact Owner or Do Field Work Also</Text>
                    <Text style={styles.stepSub}>Contact owner for identity verification or send field agent for on-site inquiry.</Text>
                  </View>
                </View>

                {item.stage === 0 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(1, 'contacted_or_fieldwork', 'Owner contacted and local field inquiry initiated.')}
                    style={styles.actionBtn}
                    activeOpacity={0.85}
                  >
                    <Phone size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Log Owner Contact / Field Work Conducted</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Step 3: Collect Details */}
              <View style={[styles.stepCard, item.stage >= 2 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 2 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>3</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Collect Details</Text>
                    <Text style={styles.stepSub}>Gather Sub-Registrar land registry records, Nil Encumbrance, and CCTNS police report.</Text>
                  </View>
                </View>

                {item.stage === 1 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(2, 'details_collected', 'Title, court, and police records collected.')}
                    style={styles.actionBtn}
                    activeOpacity={0.85}
                  >
                    <ShieldCheck size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Collect Details (Title Deed & Police Records)</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Step 4: Admin Send Details to User Through Digital */}
              <View style={[styles.stepCard, item.stage >= 3 && styles.stepCardActive]}>
                <View style={styles.stepCardHeader}>
                  <View style={[styles.stepNumCircle, item.stage >= 3 && styles.stepNumCircleDone]}>
                    <Text style={styles.stepNumText}>4</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.stepTitle}>Admin Send Details to User Through Digital</Text>
                    <Text style={styles.stepSub}>Deliver certified Owner Verification Dossier & PDF certificate to user app & email.</Text>
                  </View>
                </View>

                {item.stage === 2 && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStage(3, 'sent_digitally', 'Official verified dossier sent to user digitally!')}
                    style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
                    activeOpacity={0.85}
                  >
                    <Send size={14} color={colors.textWhite} />
                    <Text style={styles.actionBtnText}>Admin Send Details to User Through Digital</Text>
                  </TouchableOpacity>
                )}

                {item.stage >= 3 && (
                  <View style={styles.doneBanner}>
                    <CheckCircle2 size={16} color={colors.secondary} />
                    <Text style={styles.doneBannerText}>Details Sent to User Digitally · Clear Report Delivered</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Admin Internal Notes Box */}
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Admin Internal Action Log & Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add internal notes about phone verification, field visit date, or documentation..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              value={adminNotes}
              onChangeText={setAdminNotes}
            />
          </View>

          <TouchableOpacity onPress={pop} style={styles.backToDashboardBtn} activeOpacity={0.85}>
            <Text style={styles.backToDashboardText}>← Back to Admin Queues</Text>
          </TouchableOpacity>
        </View>
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
    fontWeight: '800',
    color: colors.primary,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  scrollArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  metaBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 10,
    padding: 10,
    gap: 4,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  detailGridCell: {
    width: '48%',
    backgroundColor: colors.surfaceSoft,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  detailGridKey: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
  },
  detailGridVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  quickContactRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contactBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    gap: 6,
  },
  contactBtnOutlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  contactBtnSolid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    gap: 6,
  },
  contactBtnSolidText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textWhite,
  },
  actionSuccessNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondaryBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  actionSuccessNoticeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    flex: 1,
  },
  workflowSection: {
    marginBottom: 16,
  },
  workflowHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  stepCardActive: {
    borderColor: colors.primary,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.tertiaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumCircleDone: {
    backgroundColor: colors.secondary,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textWhite,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  stepSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 8,
    marginTop: 10,
  },
  actionBtnText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.secondaryBg,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  doneBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
  },
  decisionWrap: {
    marginTop: 12,
    gap: 8,
  },
  decisionPrompt: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  decisionMatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  decisionMatchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textWhite,
  },
  decisionRejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerBg,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  decisionRejectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  rejectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.dangerBg,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  rejectedBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
    flex: 1,
  },
  notesCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 10,
    fontSize: 12,
    color: colors.primary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  backToDashboardBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  backToDashboardText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
