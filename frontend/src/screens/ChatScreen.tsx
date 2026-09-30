import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChevronLeft, Send, Paperclip, Phone, MapPin } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import type { Property } from '../types';

const quickReplies = [
  'Is this property still available?',
  'What is the final price?',
  'Can I visit tomorrow?',
  'Is there any negotiation possible?',
];

interface Message {
  id: string;
  text: string;
  from: 'user' | 'owner';
  time: string;
}

const initialMessages: Message[] = [
  { id: '1', text: 'Hi! I am interested in this property. Can you share more details?', from: 'user', time: '10:30 AM' },
  { id: '2', text: "Hello! Thank you for your interest. Yes, the property is available. It's a well-maintained flat on the 8th floor with a great view.", from: 'owner', time: '10:32 AM' },
  { id: '3', text: 'Is the price negotiable?', from: 'user', time: '10:33 AM' },
  { id: '4', text: 'We can discuss. The listed price is our best offer, but we can work out on the furnishing or registration charges.', from: 'owner', time: '10:35 AM' },
];

export default function ChatScreen() {
  const { currentScreen, pop, push } = useApp();
  const property = currentScreen.params?.property as Property;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), text, from: 'user', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, newMsg]);
    setInput('');
    setTimeout(() => {
      const replies = ['Sure, I can arrange a visit. When are you available?', 'Thank you for your message. Let me check and get back to you.', "Yes, that's possible. Would you like to discuss in person?"];
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), text: replies[Math.floor(Math.random() * replies.length)], from: 'owner', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pop} style={styles.iconCircle} activeOpacity={0.8}>
          <ChevronLeft size={20} color="#111827" strokeWidth={2.5} />
        </TouchableOpacity>
        <Image source={{ uri: property.ownerAvatar }} style={styles.ownerAvatar} />
        <View style={styles.headerTitleCol}>
          <Text style={styles.ownerName}>{property.ownerName}</Text>
          <Text style={styles.onlineStatus}>Online</Text>
        </View>
        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.8}>
          <Phone size={16} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Property Context Strip */}
      <View style={styles.contextPadding}>
        <TouchableOpacity
          onPress={() => push({ name: 'propertyDetail', params: { property } })}
          style={styles.contextCard}
          activeOpacity={0.8}
        >
          <Image source={{ uri: property.image }} style={styles.contextImage} />
          <View style={styles.contextTextCol}>
            <Text style={styles.contextTitle} numberOfLines={1}>{property.title}</Text>
            <View style={styles.locationRow}>
              <MapPin size={10} color="#9CA3AF" />
              <Text style={styles.locationText} numberOfLines={1}>{property.location}</Text>
            </View>
            <Text style={styles.contextPrice}>{property.priceLabel}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        style={styles.messagesScroll}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(msg => (
          <View
            key={msg.id}
            style={[styles.messageBubbleRow, msg.from === 'user' ? styles.userRow : styles.ownerRow]}
          >
            {msg.from === 'owner' && (
              <Image source={{ uri: property.ownerAvatar }} style={styles.smallAvatar} />
            )}
            <View style={[styles.messageBubble, msg.from === 'user' ? styles.userBubble : styles.ownerBubble]}>
              <Text style={[styles.messageText, msg.from === 'user' ? styles.userMessageText : styles.ownerMessageText]}>
                {msg.text}
              </Text>
              <Text style={[styles.messageTime, msg.from === 'user' ? styles.userTimeText : styles.ownerTimeText]}>
                {msg.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Replies */}
      <View style={styles.quickRepliesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesScroll}>
          {quickReplies.map(r => (
            <TouchableOpacity key={r} onPress={() => send(r)} style={styles.quickReplyChip} activeOpacity={0.8}>
              <Text style={styles.quickReplyText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.paperclipButton}>
          <Paperclip size={17} color="#6B7280" />
        </TouchableOpacity>
        <TextInput
          style={styles.chatInput}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send(input)}
        />
        <TouchableOpacity
          onPress={() => send(input)}
          disabled={!input.trim()}
          style={[styles.sendButton, !input.trim() ? styles.disabledSend : null]}
          activeOpacity={0.8}
        >
          <Send size={16} color="white" />
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECEEF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 10,
  },
  headerTitleCol: {
    flex: 1,
    marginLeft: 10,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  onlineStatus: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '500',
  },
  contextPadding: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  contextCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    elevation: 1,
  },
  contextImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  contextTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  contextTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 2,
  },
  contextPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2260FF',
    marginTop: 2,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  ownerRow: {
    justifyContent: 'flex-start',
  },
  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 6,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#2260FF',
    borderBottomRightRadius: 2,
  },
  ownerBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  ownerMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  ownerTimeText: {
    color: '#9CA3AF',
  },
  quickRepliesSection: {
    paddingVertical: 6,
  },
  quickRepliesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickReplyChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    elevation: 1,
  },
  quickReplyText: {
    fontSize: 11,
    color: '#6B7280',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  paperclipButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECEEF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#ECEEF5',
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 38,
    fontSize: 13,
    color: '#111827',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2260FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledSend: {
    opacity: 0.4,
  },
});
